'use strict';
var defaultTransform = it => it;

var unique = (optionsOrAry) => {
    var ary = undefined;
    var transform = defaultTransform;

    if (Array.isArray(optionsOrAry)) {
        ary = optionsOrAry;
    }
    else {
        var {
            from,
            // FIXME: this might be better called transformItem
            // or just transform
            transformOption = defaultTransform
        } = optionsOrAry;

        ary = from;
        transform = transformOption;
    }

    return (
        ary.filter((it, index, self) => self.findIndex((other) => {
            return transform(other) === transform(it)
        }) === index)
    )
};

module.exports = unique;
