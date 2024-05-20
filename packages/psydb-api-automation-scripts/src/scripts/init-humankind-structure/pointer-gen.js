'use strict';
var PointerGen = (definitions, subChannelKey = 'scientific') => (keys) => {
    var out = [];
    for (var k of keys) {
        var def = definitions[k];
        var { __subChannelKey } = def;
        out.push(`/${__subChannelKey || subChannelKey}/state/custom/${k}`)
    }
    return out;
};

module.exports = PointerGen;
