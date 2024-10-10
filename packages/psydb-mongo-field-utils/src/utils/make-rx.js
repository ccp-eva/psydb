'use strict';
var escapeRX = require('escape-string-regexp');
var { toRegex } = require('diacritic-regex');

var makeRX = (str) => (
    toRegex()(escapeRX(str))
)

module.exports = makeRX;
