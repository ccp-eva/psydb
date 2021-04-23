'use strict';

var {
    ExactObject,
    
    CustomRecordTypeName,
    CustomRecordTypeFieldKey,
} = require('@mpieva/psydb-schema-fields');


var ExternalLocationGroupingsItem = ({} = {}) => ExactObject({
    systemType: 'ExternalLocationGroupingsItem',
    properties: {
        subjectRecordType: CustomRecordTypeName({
            collection: 'subject'
        }),
        // thats the custom location field we do
        // the grouping by
        locationFieldKey: CustomRecordTypeFieldKey({
            collection: 'subject',
            // TODO: we need to handle that relation to subjectRecordType
            type: { $data: '1/subjectRecordType' }
        }), 
    },
    required: [
        'subjectType',
        'locationFieldKey',
    ]
});

module.exports = ExternalLocationGroupingsItem;
