'use strict';
var CustomProps = require('../../common/custom-props'),
    systemPermissionsSchema = require('../../common/system-permissions-schema'),
    testingPermissionsSchema = require('./testing-permissions-schema'),
    internalsSchema = require('./internals-schema');

var {
    DefaultArray,
    ExactObject,
    ForeignId,
    DateTimeInterval,
} = require('@mpieva/psydb-schema-fields');

var SubjectScientificState = ({
    enableInternalProps,
    customFieldDefinitions,
} = {}) => {
    var schema = ExactObject({
        properties: {
            custom: CustomProps({ customFieldDefinitions }),
            testingPermissions: testingPermissionsSchema,
            systemPermissions: systemPermissionsSchema,
            ...(enableInternalProps && {
                internals: internalsSchema,
            })
        },
        required: [
            'custom',
            'testingPermissions',
            'systemPermissions',
            ...(enableInternalProps ? [
                'internals',
            ] : [])
        ]
    });

    return schema;
};

module.exports = SubjectScientificState;
