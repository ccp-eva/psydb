'use strict';
// NOTE: im not happy with this
var __filterValidObjects = (bag) => {
    var { parsed } = bag;
    
    var validObjects = []
    for (var it of parsed) {
        var { obj, isValid } = it;
        if (isValid) {
            validObjects.push(obj);
        }
    }

    return validObjects;
}

module.exports = __filterValidObjects;
