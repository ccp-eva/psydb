'use strict';
var createTypedSchemas = ({ records, instructions }) => (
    records.map(record => {
        var { collection, type, subtype } = record;

        var createSchemas = (
            subtype
            ? instructions[collection].children[type].default
            : instructions[collection].default
        );

        return ({
            collection,
            type,
            ...(subtype ? { subtype } : undefined),
            schemas: createSchemas({ record })
        });
    })
);

module.exports = createTypedSchemas;
