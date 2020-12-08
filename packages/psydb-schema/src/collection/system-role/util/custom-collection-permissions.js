'use strict';
var inline = require('@cdxoo/inline-text'),
    //EnableMinimalReadAccess = require('./enable-minimal-read-access'),
    AllTypePermission = require('./all-type-permission');

var CustomCollectionPermissions = ({
    types,
    additionalProps,
} = {}) => {
    return ({
        type: 'object',
        properties: {
            //enableMinimalReadAccess: EnableMinimalReadAccess(),
            ...additionalProps,
            types: AllTypePermissions({ types }),
        },
        required: [
            //'enableMinimalReadAccess',
            ...(additionalProps ? Object.keys(additionalProps) : []),
            'types',
        ]
    });
};

module.exports = CustomCollectionPermissions;
