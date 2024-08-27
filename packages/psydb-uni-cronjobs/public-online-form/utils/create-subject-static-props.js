'use strict';
var { flatten, entries } = require('@mpieva/psydb-core-utils');

var createSubjectStaticProps = (bag) => {
    var { recordType, ...pass } = bag;
    var handler = handlers[recordType];
    return flatten(handler(pass));
}

var handlers = {
    'humankindAdult': ({ researchGroupIds }) => ({
        gdpr: { custom: {
            address: { country: 'DE' },
            dateOfBirth: '1900-01-01T00:00:00.000Z', // XXX
        }},
        scientific: {
            custom: {
                doesDBRegistrationConsentOnPaperExist: false,
                consent_for_adult_db: false, // XXX
            },
            comment: 'via Online-Registrierung',
            testingPermissions: TestingPermissions({
                researchGroupIds,
                permissions: { 'inhouse': 'unknown' }
            }),
            systemPermissions: SystemPermissions({ researchGroupIds }),
        }
    }),

    'humankindChild': ({ researchGroupIds, parentIds, siblingCount }) => ({
        scientific: {
            custom: {
                parentIds,
                siblingCount,

                doesDBRegistrationConsentOnPaperExist: false,
                canParticipateInStudiesWithHealthyChildren: 'unknown',
                hasAwayTeamTestingPermissionForNextYear: 'unknown',
                didConsentToStayInDBAsAdult: 'unknown',
                allowedToEat: 'unknown',
                kigaId: null,

                otherLanguageIds: [], // FIXME: fallback when no value
                                      // not even 'Keine' in DB
            },
            comment: 'via Online-Registrierung',

            testingPermissions: TestingPermissions({
                researchGroupIds,
                permissions: { 'inhouse': 'yes', 'away-team': 'unknown' }
            }),
            systemPermissions: SystemPermissions({ researchGroupIds }),
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
