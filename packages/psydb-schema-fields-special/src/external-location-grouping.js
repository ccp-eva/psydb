'use strict';
var {
    ExactObject,
} = require('@mpieva/psydb-schema-fields');

var ExternalLocationGrouping = ({
    subjectRecordType,
    subjectRecordTypeScientificFields,
}) => {
    var locationFieldKeys = [],
        locationFieldDisplayNames = [];
    for (var field of subjectRecordTypeScientificFields) {
        if (
            field.type === 'ForeignId'
            && field.props.collection === 'location'
        ) {
            locationFieldKeys.push(field.key);
            locationFieldDisplayNames.push(field.displayName);
        }
    }

    return ({
        type: 'object',
        lazyResolveProp: 'enabled',
        title: 'Tests via Aussen-Team',
        oneOf: [

            ExactObject({
                title: 'Nein',
                properties: {
                    enabled: {
                        type: 'boolean',
                        const: false,
                        default: false,
                    }
                },
                required: [
                    'enabled',
                ]
            }),
            
            ExactObject({
                title: 'Ja',
                properties: {
                    enabled: {
                        type: 'boolean',
                        const: true,
                        default: true,
                    },
                    fieldKey: {
                        type: 'string',
                        enum: locationFieldKeys,
                        // FIXME: enumNames is rjsf not sure if we
                        // want that here
                        enumNames: locationFieldDisplayNames,
                    }
                },
                required: [
                    'enabled',
                ]
            }),
            
        ]
    });
}

module.exports = ExternalLocationGrouping;
