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

    // Write body to file for body-path
    fs.writeFileSync('/tmp/release-body.md', body);

    core.setOutput('skip', 'false');
    core.setOutput('new_version', newVersion);
    core.setOutput('release_type', bumpType);
    core.setOutput('commit_message', `chore(release): v${newVersion}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
