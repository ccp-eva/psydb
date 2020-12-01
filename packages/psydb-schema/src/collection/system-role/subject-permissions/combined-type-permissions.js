'use strict';
var FieldAccessMap = require('./field-access-map');

var CombinedTypePermissions = ({
    schemaTreeNodes 
} = {}) => {
    var combined = Object.keys(schemaTreeNodes).reduce(
        (acc, key) => {
            var {
                state: stateSchema,
                scientific: scientificSchema,
                gdpr: gdprSchema,
            } = schemaTreeNodes[key].schemas;

            if (stateSchema) {
                var stateFieldAccess = FieldAccessMap({
                    schema: stateSchema
                });
                return ({
                    ...acc,
                    [key]: {
                        type: 'object',
                        properties: { state: stateFieldAccess },
                        required: [ 'state' ],
                    }
                })
            }
            else {
                var scientificFieldAccess = FieldAccessMap({
                    schema: scientificSchema
                });
                var gdprFieldAccess = FieldAccessMap({
                    schema: gdprSchema
                });
                return ({
                    ...acc,
                    [key]: {
                        type: 'object',
                        properties: {
                            scientific: scientificFieldAccess,
                            gdpr: gdprFieldAccess,
                        },
                        required: [ 'scientific', 'gdpr' ],
                    }
                })
            }
        },
        {}
    );

    return ({
        type: 'object',
        properties: combined,
        required: Object.keys(combined),
    });
}

module.exports = CombinedTypePermissions;
