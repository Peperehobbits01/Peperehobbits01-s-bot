const calculXp = (xp, level) => {
	let xptotal = 0;
	for (let i = 0; i < level + 1; i++) xptotal += Math.round(100 * Math.pow(1.25, level));
	xptotal += xp;
	return xptotal;
}

module.exports = {calculXp}
