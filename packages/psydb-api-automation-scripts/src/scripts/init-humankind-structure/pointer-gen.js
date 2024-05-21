'use strict';
var PointerGen = (definitions, subChannelKey) => (keys) => {
    var out = [];
    for (var k of keys) {
        var def = definitions[k];
        var { __subChannelKey = subChannelKey } = def;

        out.push(
            __subChannelKey
            ? `/${__subChannelKey}/state/custom/${k}`
            : `/state/custom/${k}`
        );
    }
    return out;
};

module.exports = PointerGen;
