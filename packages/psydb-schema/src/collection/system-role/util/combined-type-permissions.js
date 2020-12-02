'use strict';
var inline = require('@cdxoo/inline-text'),
    FieldAccessMap = require('./field-access-map');

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

            if (!stateSchema && !(scientificSchemas && scientificSchemas.state)) {
                throw new Error(inline`
                    either "state" or "scientific.state" must be set
                    in schema tree node with key "${key}"
                `)
            }

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
                        required: [
                            'scientific',
                            ...(gdprFieldAccess ? [ 'gdpr' ] : []),
                        ],
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
