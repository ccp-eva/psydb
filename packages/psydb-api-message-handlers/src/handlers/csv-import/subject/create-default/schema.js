'use strict';
var {
    ClosedObject,
    DefaultBool,
    ForeignId,
    CustomRecordTypeKey,
} = require('@mpieva/psydb-schema-fields');

var {
    AccessRightsByRsearchGroup,
} = require('@mpieva/psydb-schema-fields-special');


var Schema = async (context) => {
    var schema = ClosedObject({
        subjectType: CustomRecordTypeKey({ collection: 'subject' }),
        fileId: ForeignId({ collection: 'file' }),
        researchGroupId: ForeignId({ collection: 'researchGroup' }),
        //accessRightsByBesearchGroup: AccessRightsByResearchGroup()
    });
    
    return schema;
}

module.exports = Schema;
