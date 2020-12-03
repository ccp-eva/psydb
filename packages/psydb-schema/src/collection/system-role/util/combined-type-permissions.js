'use strict';
var inline = require('@cdxoo/inline-text'),
    createFieldgroupProps = require('./create-fieldgroup-props');

var CombinedTypePermissions = ({
    schemaTreeNode,
} = {}) => {
    var types = schemaTreeNode ? schemaTreeNode.children : {};
    
    var combined = Object.keys(types).reduce(
        (acc, key) => {
            var {
                state: stateSchema,
                scientific: scientificSchemas,
                gdpr: gdprSchemas,
            } = types[key].schemas;

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
            })
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
