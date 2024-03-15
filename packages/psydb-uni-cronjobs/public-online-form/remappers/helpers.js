'use strict';

var sane = (v) => String(v).trim();
var lc = (s) => s.toLowerCase();
var justremap = (simpleMap) => simpleMap.reduce((acc, it) => {
    var [ str, path ] = it;
    return { ...acc, [str]: value => ({ path, value })}
}, {});

module.exports = {
    sane,
    lc,
    justremap
}
