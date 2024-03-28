'use strict';
var {
    ClosedObject,
    DefaultBool,
    ForeignId,
    CustomRecordTypeKey,
} = require('@mpieva/psydb-schema-fields');

var { ageFrame } = require('@mpieva/psydb-schema-creators');

var Schema = async (context) => {
    var schema = ClosedObject({
        studyId: ForeignId({ collection: 'study' }),
        subjectSelectorId: ForeignId({ collection: 'subjectSelector' }),
        subjectTypeKey: CustomRecordTypeKey({ collection: 'subject' }),

        props: ageFrame.State(),
    });
    
    return schema;
}

module.exports = Schema;
