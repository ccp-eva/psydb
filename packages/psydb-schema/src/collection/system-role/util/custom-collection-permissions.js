'use strict';
var inline = require('@cdxoo/inline-text'),
    nodeSubtypes = require('./get-tree-node-subtypes'),
    EnableMinimalReadAccess = require('./enable-minimal-read-access'),
    createFieldgroupProps = require('./create-fieldgroup-props');

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
                    [key]: AllTypePermissions({
                        types: currentType.children
                    })
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

                return ({
                    ...acc,
                    [key]: {
                        type: 'object',
                        properties: fieldgroupProps,
                        required: Object.keys(fieldgroupProps),
                    }
                });
            }
            else {
                throw new Error(inline`
                    type "${key}" shoild either have "children" or
                    "schemas" property
                `);
            }
        },
        {}
    ),
    required: Object.keys(types),
})

var CustomCollectionPermissions = ({
    customTypes,
    fixedTypes,
    additionalProps,
} = {}) => {
    return ({
        type: 'object',
        properties: {
            enableMinimalReadAccess: EnableMinimalReadAccess(),
            ...additionalProps,
            fixedTypes: AllTypePermissions({ types: fixedTypes }),
            types: AllTypePermissions({ types: customTypes }),
        },
        required: [
            'enableMinimalReadAccess',
            ...(additionalProps ? Object.keys(additionalProps) : []),
            'types',
        ]
    });
};

module.exports = CustomCollectionPermissions;
