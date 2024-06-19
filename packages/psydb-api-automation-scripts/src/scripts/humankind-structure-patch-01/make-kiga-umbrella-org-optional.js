'use strict';

module.exports = async (bag) => {
    var { driver, crtId } = bag;

    await driver.sendMessage({
        type: `custom-record-types/patch-field-definition`,
        payload: {
            id: crtId,
            fieldKey: 'kigaUmbrellaOrgId' ,
            //pointer: '/gdpr/state/custom/address',
            props: {
                type: 'ForeignId',
                key: 'kigaUmbrellaOrgId',
                displayName: 'Umrella Org',
                displayNameI18N: { 'de': 'Träger' },
                props: {
                    collection: 'externalOrganization',
                    recordType: 'kigaUmbrellaOrg',
                    isNullable: true,
                    constraints: {},
                    displayEmptyAsUnknown: false,
                    addReferenceToTarget: false,
                }
            }
        },
    });
    await driver.sendMessage({
        type: `custom-record-types/commit-settings`,
        payload: { id: crtId }
    });

}
