'use strict';
var PointerGen = (definitions, subChannelKey) => (keys) => {
    var out = [];
    for (var k of keys) {
        var def = definitions[k];
        if (def) {
            var { __subChannelKey = subChannelKey } = def;

            out.push(
                __subChannelKey
                ? `/${__subChannelKey}/state/custom/${k}`
                : `/state/custom/${k}`
            );
        }
        else {
            out.push(
                subChannelKey
                ? `/${subChannelKey}/state/${k}`
                : `/state/${k}`
            );
        }
    }
    return out;
};

module.exports = PointerGen;
