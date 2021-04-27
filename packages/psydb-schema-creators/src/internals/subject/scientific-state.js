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
                studyParticipation: DefaultArray({
                    items: ExactObject({
                        properties: {
                            studyId: ForeignId({
                                collection: 'study',
                            }),
                            interval: DateTimeInterval()
                        },
                        required: [
                            'studyId',
                            'interval',
                        ]
                    })
                })
            })
        },
        required: [
            'custom',
            'testingPermissions',
            'systemPermissions',
            ...(enableInternalProps ? [
                'participatedInStudyIds'
            ] : [])
        ]
    });

    return schema;
};

module.exports = SubjectScientificState;
