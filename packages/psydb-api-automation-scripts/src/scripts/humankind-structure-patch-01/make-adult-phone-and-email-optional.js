'use strict';

module.exports = async (bag) => {
    var { driver, crtId } = bag;

    await driver.sendMessage({
        type: `custom-record-types/patch-field-definition`,
        payload: {
            id: crtId,
            subChannelKey: 'gdpr',
            fieldKey: 'phones' ,
            //pointer: '/gdpr/state/custom/address',
            props: {
                type: 'PhoneList',
                key: 'phones',
                displayName: 'Phone',
                displayNameI18N: { 'de': 'Telefon' },
                props: { minItems: 0 }
            }
        },
    });
    
    await driver.sendMessage({
        type: `custom-record-types/patch-field-definition`,
        payload: {
            id: crtId,
            subChannelKey: 'gdpr',
            fieldKey: 'email' ,
            //pointer: '/gdpr/state/custom/address',
            props: {
                type: 'Email',
                key: 'email',
                displayName: 'E-Mail',
                displayNameI18N: { 'de': 'E-Mail' },
                props: { minLength: 0 }
            }
        },
    });
    await driver.sendMessage({
        type: `custom-record-types/commit-settings`,
        payload: { id: crtId }
    });

}
