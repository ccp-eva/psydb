'use strict';
var { toRegex } = require('./diacritic-regex');
var escapeRX = require('./escape-rx');

var makeDiaRX = (str, options = {}) => {
    return toRegex(options)(escapeRX(str));
}

module.exports = makeDiaRX;
