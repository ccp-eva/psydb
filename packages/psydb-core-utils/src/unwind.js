'use strict';
var arrify = require('./arrify');

var unwind = ({ items, byPath }) => {
    items = arrify(items);
    
    if (byPath.indexOf('.') !== -1) {
        return unwindDeep({ items, path: byPath });
    }
    else {
        return unwindShallow({ items, prop: byPath });
    }
}

var unwindShallow = ({ items, prop }) => (
    items.reduce((acc, obj) => ([
        ...acc,
        ...createManyFromOne({ obj, key: prop })
    ]), [])
)

var unwindDeep = ({ items, path }) => {
    var [ currentProp, ...rest ] = path.split('.');
    var innerPath = rest.join('.');

    return (
        items.reduce((acc, obj) => {
            var innerItems = obj[currentProp];

            var augmentedObj = {
                ...obj,
                [currentProp]: unwind({
                    items: innerItems,
                    byPath: innerPath,
                })
            }

            return [
                ...acc,
                ...createManyFromOne({
                    obj: augmentedObj,
                    key: currentProp
                })
            ]
        }, [])
    );
}

var createManyFromOne = ({ obj, key, values }) => {
    var values = values || obj[key];
    return (
        values.map(value => ({
            ...obj,
            [key]: value
        }))
    )
}

module.exports = unwind;
