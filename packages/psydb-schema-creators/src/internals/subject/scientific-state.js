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

var SubjectScientificState = (options = {}) => {
    var {
        enableInternalProps,
        customFieldDefinitions,
        requiresTestingPermissions,
        extraOptions = {},
    } = options;

    var { enableComment = true } = extraOptions;

    var schema = ExactObject({
        properties: {
            custom: CustomProps({ customFieldDefinitions }),
            testingPermissions: testingPermissionsSchema,
            systemPermissions: systemPermissionsSchema,
            ...(enableComment && {
                comment: FullText({
                    title: 'Kommentar',
                }),
            }),
            ...(enableInternalProps && {
                internals: InternalsSchema(),
            })
        },
        required: [
            'custom',
            ...(requiresTestingPermissions ? [
                'testingPermissions'
            ] : []),
            'systemPermissions',
            ...(enableComment ? [
                'comment',
            ] : []),
            ...(enableInternalProps ? [
                'internals',
            ] : [])
        ]
    });

    return schema;
};

module.exports = SubjectScientificState;
