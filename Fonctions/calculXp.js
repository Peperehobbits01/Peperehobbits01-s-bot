const calculXp = (xp, level) => {
	let xptotal = 0;
	for (let i = 0; i < level + 1; i++) xptotal += Math.round(10 * Math.pow(1.12, level) * 10);
	xptotal += xp;
	return xptotal;
}

module.exports = {calculXp}
