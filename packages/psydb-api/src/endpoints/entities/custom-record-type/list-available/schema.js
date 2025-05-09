'use strict';
var {
    ExactObject,
    DefaultArray,
    StringEnum,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var { allCRTCollections } = require('@mpieva/psydb-api-lib');


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
