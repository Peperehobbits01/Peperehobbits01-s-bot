const calculXp = (xp, level) => {
    let xptotal = 0;
    for(let i = 0; i < level + 1; i++) xptotal += i * 1000
    xptotal += xp;
    return xptotal;
}

module.exports = { calculXp }