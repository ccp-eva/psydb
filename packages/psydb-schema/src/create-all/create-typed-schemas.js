'use strict';
var { fieldDefinitionsToSchema } = require('@mpieva/psydb-schema-helpers');

var createTypedSchemas = ({ records, instructions }) => (
    records.map(record => {
        var { collection, type, subtype } = record;

        //console.log(collection);
        //console.log(type);
        //console.dir(record.state, { depth: null });

        var createSchemas = (
            subtype
            ? instructions[collection].children[type].default
            : instructions[collection].default
        );

        var settings = record.state.settings;

        var convertedCustomFields = undefined;
        if (settings.subChannelFields) {
            convertedCustomFields = (
                Object.keys(settings.subChannelFields)
                .reduce((acc, subChannelKey) => ({
                    [subChannelKey]: fieldDefinitionsToSchema(
                        settings.subChannelFields[subChannelKey]
                    )
                }), {})
            );
        }
        else {
            convertedCustomFields = fieldDefinitionsToSchema(
                settings.fields  
            );
        }

        return ({
            collection,
            type,
            ...(subtype ? { subtype } : undefined),
            schemas: createSchemas({
                type,
                customStateSchema: convertedCustomFields
            })
        });
    })
);

module.exports = createTypedSchemas;
