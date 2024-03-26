'use strict';
var {
    ExactObject,
    DefaultArray,
    StringEnum,
} = require('@mpieva/psydb-schema-fields');

var allCRTCollections = require('./all-crt-collections');

var Schema = (bag = {}) => {
    return ExactObject({
        properties: {
            collections: DefaultArray({
                items: StringEnum(allCRTCollections)
            })
        },
        required: []
    })
}

module.exports = Schema;
