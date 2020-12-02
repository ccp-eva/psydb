'use strict';
var FieldAccessMap = require('./field-access-map');

var createFieldgroupProps = ({
    stateSchema,
    scientificSchemas,
    gdprSchemas
}) => {

    if (!stateSchema && !(scientificSchemas && scientificSchemas.state)) {
        throw new Error(inline`
            either "state" or "scientific.state" must be set
            when creating fieldgroup properties
        `);
    }

    if (stateSchema) {
        return ({
            state: FieldAccessMap({
                schema: stateSchema
            })
        });
    }
    else {
        var props = {
            scientific: FieldAccessMap({
                schema: scientificSchemas.state
            })
        };
        if (gdprSchemas) {
            props.gdpr = FieldAccessMap({
                schema: gdprSchemas.state
            });
        }
        return props;
    }
}

module.exports = createFieldgroupProps;
