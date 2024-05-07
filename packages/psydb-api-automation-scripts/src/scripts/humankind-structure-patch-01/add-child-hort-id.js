'use strict';

module.exports = async (bag) => {
    var { driver, crtId } = bag;

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'ForeignId',
            key: 'hortId',
            displayName: 'After-School Care Center',
            displayNameI18N: { 'de': 'Hort' },
            props: {
                collection: 'location',
                recordType: 'hort',
                isNullable: true,
                readOnly: false,
                constraints: {},
                displayEmptyAsUnknown: false,
                addReferenceToTarget: false,
            },
        }},
    });

    await driver.sendMessage({
        type: `custom-record-types/commit-settings`,
        payload: { id: crtId }
    });

    await driver.sendMessage({
        type: `custom-record-types/set-form-order`,
        payload: { id: crtId, formOrder: [
            '/sequenceNumber',
            '/onlineId',
            '/gdpr/state/custom/firstname',
            '/gdpr/state/custom/lastname',
            '/gdpr/state/custom/dateOfBirth',
            '/gdpr/state/custom/gender',
            '/scientific/state/custom/siblingCount',
            '/scientific/state/custom/parentIds',
            '/scientific/state/custom/nativeLanguageId',
            '/scientific/state/custom/otherLanguageIds',
            '/scientific/state/custom/kigaId',
            '/scientific/state/custom/hortId',
            '/scientific/state/custom/doesDBRegistrationConsentOnPaperExist',
            '/scientific/state/custom/canParticipateInStudiesWithHealthyChildren',
            '/scientific/state/custom/allowedToEat',
            '/scientific/state/custom/didConsentToStayInDBAsAdult',
            '/scientific/state/custom/hasAwayTeamTestingPermissionForNextYear',
            '/scientific/state/testingPermissions',
            '/scientific/state/comment'
        ]}
    });

}
