'use strict';
var FieldAccessMap = require('./field-access-map');

var CombinedTypePermissions = ({
    schemaTreeNodes 
} = {}) => {
    var combined = Object.keys(schemaTreeNodes).reduce(
        (acc, key) => {
            var {
                state: stateSchema,
                scientific: scientificSchemas,
                gdpr: gdprSchemas,
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
                    schema: scientificSchemas.state
                });
                var gdprFieldAccess = undefined;
                if (gdprSchemas) {
                    gdprFieldAccess = FieldAccessMap({
                        schema: gdprSchemas.state
                    });
                }
                return ({
                    ...acc,
                    [key]: {
                        type: 'object',
                        properties: {
                            scientific: scientificFieldAccess,
                            ...(gdprFieldAccess && {
                                gdpr: gdprFieldAccess 
                            })
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
