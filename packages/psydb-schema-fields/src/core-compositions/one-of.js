'use strict';

var OneOf = (...args) => {
    var oneOf = [];
    var keywords = {}

    if (Array.isArray(args)) {
        oneOf = args[0];
    }
    else {
        ({ oneOf, ...keywords } = args[0]);
    }

    return { ...keywords, oneOf }
}

module.exports = OneOf;
