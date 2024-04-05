'use strict';
var {
    DefaultArray,
    ClosedObject,
    ForeignId,
    StringEnum
} = require('@mpieva/psydb-schema-fields');

var AccessRightsByResearchGroup = DefaultArray({
    minItems: 1,
    // unqiueItemProperties requires "ajv-keywords"
    uniqueItemProperties: [ 'researchGroupId' ],
    items: ClosedObject({
        researchGroupId: ForeignId({ collection: 'researchGroup' }),
        permission: StringEnum([ 'read', 'write' ])
    })
});

module.exports = { AccessRightsByResearchGroup }
