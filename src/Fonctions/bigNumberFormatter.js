module.exports = (number) => {
	return new Intl.NumberFormat("en", {
		notation: "compact",
		compactDisplay: "short",
		maximumFractionDigits: 1
	}).format(number);
}
