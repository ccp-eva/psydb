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
                        title: 'gruppiert nach',
                        type: 'string',
                        // FIXME: there is an issue
                        // when gathering constraints for studies
                        // since we cant known the location
                        // field keys available
                        // so this produces an invalid schema
                        // which we need when searching for studies
                        // maybe we want to remove fieldKey entirely
                        // when we dont have proper data?
                        ...(locationFieldKeys.length > 0 && ({
                            enum: locationFieldKeys,
                            // FIXME: enumNames is rjsf not sure if we
                            // want that here
                            enumNames: locationFieldDisplayNames,
                        }))
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
