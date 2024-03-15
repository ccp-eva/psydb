'use strict';
var { flatten, entries } = require('@mpieva/psydb-core-utils');

var createSubjectStaticProps = (bag) => {
    var { recordType, ...pass } = bag;
    var handler = handlers[recordType];
    return flatten(handler(pass));
}

var handlers = {
    'humankindAdult': ({ researchGroupIds }) => ({
        gdpr: { custom: { address: { country: 'DE' }}},
        scientific: {
            custom: {
                dateOfBirth: '1970-01-01T00:00:00.000Z', // XXX
                doesDBRegistrationConsentOnPaperExist: false,
            },
            comment: '',
            testingPermissions: TestingPermissions({
                researchGroupIds,
                permissions: { 'inhouse': 'unknown' }
            }),
            systemPermissions: SystemPermissions()
        }
    }),

    'humankindChild': ({ researchGroupIds, parentIds, siblingCount }) => ({
        scientific: {
            custom: {
                parentIds,
                siblingCount,

                doesDBRegistrationConsentOnPaperExist: false,
                canParticipateInStudiesWithHealthyChildren: true,
                hasAwayTeamTestingPermissionForNextYear: 'unknown',
                allowedToEat: 'unknown',
                kigaId: null,
            },
            comment: '',

            testingPermissions: TestingPermissions({
                researchGroupIds,
                permissions: { 'inhouse': 'yes', 'away-team': 'unknown' }
            }),
            systemPermissions: SystemPermissions({ researchGroupIds })
        }
    }),
}

var TestingPermissions = ({ researchGroupIds, permissions }) => (
    researchGroupIds.map(it => ({
        researchGroupId: it,
        permissionList: entries(permissions).map(([k, v]) => ({
            labProcedureTypeKey: k,
            value: v
        }))
    }))
)

var SystemPermissions = ({ researchGroupIds }) => ({
    isHidden: false,
    accessRightsByResearchGroup: researchGroupIds.map(it => ({
        researchGroupId: it, permission: 'write'
    }))
})

module.exports = { createSubjectStaticProps }
