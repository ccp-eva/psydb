'use strict';
var createTypedSchemas = ({ records, instructions }) => (
    records.map(record => {
        var { entity, type, subtype } = record.state;

        var createSchemas = (
            subtype
            ? instructions[entity].children[type].default
            : instructions[entity].default
        );

        return ({
            entity,
            type,
            ...(subtype ? { subtype } : undefined),
            schemas: createSchemas({ record })
        });
    })
);

module.exports = createTypedSchemas;
