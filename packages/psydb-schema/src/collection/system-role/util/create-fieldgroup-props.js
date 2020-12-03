'use strict';
var inline = require('@cdxoo/inline-text'),
    FieldAccessMap = require('./field-access-map');

var createFieldgroupProps = ({
    stateSchema,
    scientificSchemas,
    gdprSchemas
}) => {

    if (!stateSchema && !(scientificSchemas && scientificSchemas.state)) {
        throw new Error(inline`
            either "stateSchema" or "scientificSchemas.state" must be set
            when creating fieldgroup properties
        `);
    }

    if (stateSchema) {
        return ({
            _state: FieldAccessMap({
                schema: stateSchema
            })
        });
    }
    else {
        var props = {
            _scientific: FieldAccessMap({
                schema: scientificSchemas.state
            })
        };
        if (gdprSchemas) {
            props._gdpr = FieldAccessMap({
                schema: gdprSchemas.state
            });
        }
        return props;
    }
}

module.exports = createFieldgroupProps;
