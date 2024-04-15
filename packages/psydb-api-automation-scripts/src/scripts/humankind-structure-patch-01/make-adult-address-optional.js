'use strict';

module.exports = async (bag) => {
    var { driver, crtId } = bag;

    await driver.sendMessage({
        type: `custom-record-types/patch-field-definition`,
        payload: {
            id: crtId,
            subChannelKey: 'gdpr',
            fieldKey: 'address' ,
            //pointer: '/gdpr/state/custom/address',
            props: {
                type: 'Address',
                key: 'address',
                displayName: 'Address',
                displayNameI18N: { 'de': 'Adresse' },
                props: {
                    isStreetRequired: false,
                    isHousenumberRequired: false,
                    isAffixRequired: false,
                    isPostcodeRequired: false,
                    isCityRequired: false,
                    isCountryRequired: false,
                }
            }
        },
    });
    
    await driver.sendMessage({
        type: `custom-record-types/commit-settings`,
        payload: { id: crtId }
    });

}
