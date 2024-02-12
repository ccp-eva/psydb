'use strict';
var intersect = require('./intersect');

var maybeIntersect = (bag) => {
    var { items, withMaybe, compare } = bag;
    return (
        withMaybe
        ? intersect(items, withMaybe, { compare })
        : items
    )
}
module.exports = maybeIntersect;
