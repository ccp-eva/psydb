'use strict';
var {
    ExactObject,
    DefaultArray,
    StringEnum,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var allCRTCollections = require('./all-crt-collections');

var Schema = (bag = {}) => {
    return ExactObject({
        properties: {
            collections: DefaultArray({
                items: StringEnum(allCRTCollections)
            }),
            ignoreResearchGroups: DefaultBool()
        },
        required: []
    })
}

module.exports = Schema;
