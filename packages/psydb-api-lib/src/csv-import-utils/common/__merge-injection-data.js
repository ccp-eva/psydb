'use strict';
var __mergeInjectionData = (bag) => {
    var { parsed, injectionData, pushTarget: preparedObjects } = bag;

    for (var it of parsed) {
        if (it.isValid) {
            var { obj, isOk, replacements, errors } = injectionData.shift();
            if (isOk) {
                it.isRefReplacementOk = true;
                it.replacements = replacements;
                preparedObjects.push(obj)
            }
            else {
                it.isRefReplacementOk = false;
                it.replacements = replacements;
                it.replacementErrors = errors;
            }
        }
    }
}

module.exports = __mergeInjectionData;
