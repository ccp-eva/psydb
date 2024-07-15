'use strict';
var arrify = require('./arrify');

var unwind = (bag) => {
    var { items, byPath } = bag;

    items = arrify(items);
    
    if (byPath.indexOf('.') !== -1) {
        return unwindDeep({ items, path: byPath });
    }
    else {
        return unwindShallow({ items, prop: byPath });
    }
}

var unwindShallow = (bag) => {
    var { items, prop } = bag;
    var out = [];
    for (var it of items) {
        out.push(...createManyFromOne({ obj: it, key: prop }))
    }
    return out;
}

var unwindDeep = (bag) => {
    var { items, path } = bag;

    var [ currentProp, ...rest ] = path.split('.');
    var innerPath = rest.join('.');

    var out = [];
    for (var it of items) {
        var innerItems = it[currentProp];

        var augmented = {
            ...it,
            [currentProp]: unwind({
                items: innerItems,
                byPath: innerPath,
            })
        }

        out.push(...createManyFromOne({
            obj: augmented,
            key: currentProp
        }))
    }

    return out;
}

var createManyFromOne = (bag) => {
    var { obj, key, values } = bag;
    
    var out = [];
    for (var v of (values || obj[key])) {
        out.push({ ...obj, [key]: v });
    }
    return out;
}

module.exports = unwind;
