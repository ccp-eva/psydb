'use strict';
var escapeRX = require('./escape-rx');

var makeRX = (str, options = {}) => {
    return new RegExp(escapeRX(str), 'i');
}

module.exports = makeRX;
