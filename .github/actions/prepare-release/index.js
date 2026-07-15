const fs = require('fs');
const { execSync } = require('child_process');
const core = require('@actions/core');

function getFirstCommit() {
  return execSync('git rev-list --max-parents=0 HEAD', { encoding: 'utf8' }).trim();
}

function getBumpLevel(commits) {
  if (!commits) return { level: 3, releaseType: 'none' };
  const lines = commits.split('\n');
  if (lines.some(l => /^[a-z]+(\(.+\))?!:/.test(l))) return { level: 0, releaseType: 'major' };
  if (lines.some(l => /^feat(\(.+\))?:/.test(l))) return { level: 1, releaseType: 'minor' };
  if (lines.some(l => /^fix(\(.+\))?:/.test(l))) return { level: 2, releaseType: 'patch' };
  return { level: 3, releaseType: 'none' };
}

function buildChangelog(commits, compareUrl) {
  if (!commits) return '';
  const lines = commits.split('\n');
  const feats = lines.filter(l => /^feat(\(.+\))?:/.test(l));
  const fixes = lines.filter(l => /^fix(\(.+\))?:/.test(l));
  const breakings = lines.filter(l => /^[a-z]+(\(.+\))?!:/.test(l));
  const other = lines.filter(l => !/^(feat|fix|[a-z]+\(.+\)!\?)/.test(l) && !/^[a-z]+(\(.+\))?!:/.test(l));

  let body = '# What\'s Changed\n\n';
  
  if (breakings.length) {
    body += '## BREAKING Changes\n\n';
    breakings.forEach(c => { body += `* ${c}\n`; });
    body += '\n';
  }
  if (feats.length) {
    body += '## Features\n\n';
    feats.forEach(c => { body += `* ${c}\n`; });
    body += '\n';
  }
  if (fixes.length) {
    body += '## Bug Fixes\n\n';
    fixes.forEach(c => { body += `* ${c}\n`; });
    body += '\n';
  }
  if (other.length) {
    body += '## Other Changes\n\n';
    other.forEach(c => { body += `* ${c}\n`; });
    body += '\n';
  }
  
  if (compareUrl) {
    body += `\n**Full Changelog**: [compare](${compareUrl})\n`;
  }
  return body;
}

function bumpVersion(current, releaseType) {
  if (releaseType !== 'none') {
    const bumpMap = { major: 0, minor: 1, patch: 2 };
    const idx = bumpMap[releaseType];
    return current.split('.').map((v, i, arr) => i === idx ? parseInt(v) + 1 : (i > idx ? 0 : v)).join('.');
  }
  return current;
}

async function main() {
  try {
    const currentVersion = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
    const manualBump = process.env.MANUAL_BUMP || '';

    let latestTag;
    try {
      latestTag = execSync("git tag | grep -E '^v[0-9]+\\.[0-9]+\\.[0-9]+$' | sort -V | tail -1", { encoding: 'utf8' }).trim();
    } catch { latestTag = ''; }

    const base = latestTag || getFirstCommit();
    let commits = '';
    try {
      commits = execSync(`git log "${base}..HEAD" --pretty=format:"%s" --no-merges`, { encoding: 'utf8' });
    } catch { commits = ''; }

    const detected = getBumpLevel(commits);
    const bumpType = manualBump || detected.releaseType;
    const level = manualBump ? { major: 0, minor: 1, patch: 2 }[manualBump] ?? 3 : detected.level;

    if (level === 3 && !manualBump) {
      core.info('No significant changes detected. Skipping release.');
      core.setOutput('skip', 'true');
      return;
    }

    const newVersion = bumpVersion(currentVersion, bumpType);
    
    // Update package.json
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.version = newVersion;
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

    // Changelog
    const compareUrl = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/compare/v${newVersion}...HEAD`;
    const body = buildChangelog(commits, compareUrl);

    // Write changelog to file
    fs.writeFileSync('RELEASE_BODY.md', body);

    // Commit and push
    core.startGroup('Creating release branch and pull request');
    execSync('git config user.name github-actions[bot]', { stdio: 'pipe' });
    execSync('git config user.email "41898282+github-actions[bot]@users.noreply.github.com"', { stdio: 'pipe' });

    const branch = `prepare-release-v${newVersion}`;
    try {
      execSync(`git checkout -b ${branch} origin/main 2>/dev/null || git checkout -b ${branch}`);
    } catch {
      execSync(`git checkout -b ${branch}`);
    }

    execSync(`git add package.json RELEASE_BODY.md`, { stdio: 'pipe' });
    execSync(`git commit -m "chore(release): v${newVersion}"`, { stdio: 'pipe' });
    execSync(`git push origin ${branch} --force`, { stdio: 'pipe' });

    // Check if PR already exists
    const ghToken = process.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
    try {
      const existingPR = execSync(`gh pr list --head ${branch} --json number --jq '.[0].number'`, { env: { ...process.env, GITHUB_TOKEN: ghToken }, encoding: 'utf8' }).trim();
      if (existingPR) {
        core.info(`PR #${existingPR} already exists. Updating it.`);
        execSync(`gh pr update ${existingPR} --title "Prepare release ${newVersion}" --body-file RELEASE_BODY.md`, { env: { ...process.env, GITHUB_TOKEN: ghToken }, stdio: 'inherit' });
        core.setOutput('pr_url', `${repoUrl}/${process.env.GITHUB_REPOSITORY}/pull/${existingPR}`);
        core.endGroup();
        core.setOutput('skip', 'false');
        core.setOutput('new_version', newVersion);
        core.setOutput('release_type', bumpType);
        core.setOutput('commit_message', `chore(release): v${newVersion}`);
        return;
      }
    } catch (e) {
      core.warning('Could not check for existing PR');
    }

    // Create PR
    execSync(`gh pr create --title "Prepare release ${newVersion}" --body-file RELEASE_BODY.md --base ${process.env.GITHUB_BASE_REF || 'main'} --label release`, { env: { ...process.env, GITHUB_TOKEN: ghToken }, stdio: 'inherit' });

    core.endGroup();
    core.setOutput('pr_url', `${repoUrl}/${process.env.GITHUB_REPOSITORY}/pull/${execSync('gh pr list --json url --jq \'.[0].url\'', { encoding: 'utf8' }).trim().replace(new RegExp(`^${repoUrl}/${process.env.GITHUB_REPOSITORY}/pull/`, 'i'), '')}`);

    core.setOutput('skip', 'false');
    core.setOutput('new_version', newVersion);
    core.setOutput('release_type', bumpType);
    core.setOutput('commit_message', `chore(release): v${newVersion}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
