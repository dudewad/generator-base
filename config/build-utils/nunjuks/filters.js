function ucFirst (str) {
    str = str.substr(0, 1).toUpperCase().concat(str.substr(1).toLowerCase());
    return str;
}

module.exports = {
    ucFirst
};