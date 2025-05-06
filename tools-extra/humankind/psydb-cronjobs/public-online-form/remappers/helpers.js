'use strict';
var { sane, lc } = require('../utils');

var justremap = (simpleMap) => simpleMap.reduce((acc, it) => {
    var [ str, path ] = it;
    return { ...acc, [str]: value => ({ path, value })}
}, {});

module.exports = {
    sane,
    lc,
    justremap
}
