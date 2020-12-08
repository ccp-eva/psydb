'use strict';
var inline = require('@cdxoo/inline-text'),
    createFieldgroupProps = require('./create-fieldgroup-props');
    //createTypeProps = require('./create-type-props');

var AllTypePermissions = ({
    types,
}) => ({
    type: 'object',
    properties: Object.keys(types).reduce(
        (acc, key) => {
            var currentType = types[key];
            
            if (currentType.children) {
                return ({
                    ...acc,
                    [key]: {
                        type: 'object',
                        properties: {
                            types: AllTypePermissions({
                                types: currentType.children
                            })
                        },
                        required: [
                            'types',
                        ]
                    }
                })
            }
            else if (currentType.schemas){
                var {
                    state: stateSchema,
                    scientific: scientificSchemas,
                    gdpr: gdprSchemas,
                } = currentType.schemas;

                var fieldgroupProps = createFieldgroupProps({
                    stateSchema,
                    scientificSchemas,
                    gdprSchemas,
                });

                // FIXME wanted to make it just collection level
                // i.e.: create/read/search/modify/delete by
                // type/subtype
                // but decided endpoint level is enough for now
                /*var typeProps = createTypeProps({
                    stateSchema,
                    scientificSchemas,
                    gdprSchemas,
                });*/

                return ({
                    ...acc,
                    [key]: {
                        type: 'object',
                        properties: fieldgroupProps,
                        required: Object.keys(fieldgroupProps),
                        //properties: typeProps,
                        //required: Object.keys(typeProps),
                    }
                });
            }
            else {
                throw new Error(inline`
                    type "${key}" should either have "children" or
                    "schemas" property
                `);
            }
        },
        {}
    ),
    required: Object.keys(types),
});

module.exports = AllTypePermissions;
