'use strict';

var {
    ExactObject,
    
    CustomRecordTypeName,
    CustomRecordTypeFieldKey,
} = require('@mpieva/psydb-schema-fields');


var ExternalLocationGroupingsItem = ({
    subjectRecordTypeRecords,
} = {}) => ({
    type: 'object',
    lazyResolveProp: 'subjectRecordType',
    oneOf: subjectRecordTypeRecords.map(it => (
        ExternalLocationGroupingItemOption(it)
    )),
});

var ExternalLocationGroupingItemOption = (subjectRecordTypeRecord) => {
    var {
        type,
        state: { settings: { subChannelFields: { scientific: { fields }}}}
    } = subjectRecordTypeRecord;

    // TODO: i think i need to do the field selection manually anyway
    /*var locationFieldKeys = [],
        locationFieldDisplayNames = [];
    for (var field of fields) {
        if (
            field.type === 'ForeignId'
            && field.props.collection === 'location'
        ) {
            locationFieldKeys.push(field.key);
            locationFieldDisplayNames.push(field.displayName);
        }
    }*/

    return (
        ExactObject({
            systemType: 'ExternalLocationGroupingsItem',
            properties: {
                subjectRecordType: CustomRecordTypeName({
                    collection: 'subject',
                    const: type,
                    default: type,
                }),
                // thats the custom location field we do
                // the grouping by
                locationFieldKey: CustomRecordTypeFieldKey({
                    collection: 'subject',
                    type: type,
                    //enum: locationFieldKeys,
                    //enumNames: locationFieldDisplayNames,
                }), 
            },
            required: [
                'subjectType',
                'locationFieldKey',
            ]
        })
    )
}

module.exports = ExternalLocationGroupingsItem;
