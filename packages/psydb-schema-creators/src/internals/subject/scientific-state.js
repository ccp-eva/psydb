'use strict';
var CustomProps = require('../../common/custom-props'),
    systemPermissionsSchema = require('../../common/system-permissions-schema'),
    testingPermissionsSchema = require('./testing-permissions-schema'),
    InternalsSchema = require('./internals-schema');

var {
    DefaultArray,
    ExactObject,
    ForeignId,
    DateTimeInterval,
    FullText
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
            comment: FullText({
                title: 'Kommentar',
            }),
            ...(enableInternalProps && {
                internals: InternalsSchema(),
            })
        },
        required: [
            'custom',
            'testingPermissions',
            'systemPermissions',
            'comment',
            ...(enableInternalProps ? [
                'internals',
            ] : [])
        ]
    });

    return schema;
};

module.exports = SubjectScientificState;
