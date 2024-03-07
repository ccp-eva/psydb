'use strict';
var AnyString = (keywords = {}) => {
    var schema = {
        systemType: 'AnyString',
        type: 'string',
        default: '',

        ...keywords
    }

    return schema;
}

module.exports = AnyString;
