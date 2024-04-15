'use strict';
module.exports = async ({ driver, cache, as }) => {
    await driver.sendMessage({
        type: `custom-record-types/create`,
        payload: {
            collection: 'location',
            type: 'hort',
            props: {
                label: 'After-School Care Centers',
                displayNameI18N: { 'de': 'Horte' }
            }
        },
    });

    var crtId = cache.addId({ collection: 'customRecordType', as });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'SaneString',
            key: 'name',
            displayName: 'Name',
            displayNameI18N: { 'de': 'Bezeichnung' },
            props: { minLength: 1 }
        }},
    });
 
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'Address',
            key: 'address',
            displayName: 'Address',
            displayNameI18N: { 'de': 'Adresse' },
            props: {
                isStreetRequired: true,
                isHousenumberRequired: true,
                isAffixRequired: false,
                isPostcodeRequired: true,
                isCityRequired: true,
                isCountryRequired: true,
            }
        }},
    });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'SaneString',
            key: 'head',
            displayName: 'Head',
            displayNameI18N: { 'de': 'Leiter:in' },
            props: { minLength: 0 }
        }},
    });
 
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'SaneString',
            key: 'vice',
            displayName: 'Vice',
            displayNameI18N: { 'de': 'Stellvertreter:in' },
            props: { minLength: 0 }
        }},
    });
 
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'ForeignId',
            key: 'supervisorId',
            displayName: 'Assigned RA',
            displayNameI18N: { 'de': 'Betreuer:in' },
            props: {
                collection: 'personnel',
                isNullable: true,
                constraints: {},
                displayEmptyAsUnknown: false,
                addReferenceToTarget: false,
            }
        }},
    });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'PhoneWithTypeList',
            key: 'phones',
            displayName: 'Phone',
            displayNameI18N: { 'de': 'Telefon' },
            props: { minItems: 0 }
        }},
    });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'PhoneList',
            key: 'faxes',
            displayName: 'Fax',
            displayNameI18N: { 'de': 'Fax' },
            props: { minItems: 0 }
        }},
    });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'EmailList',
            key: 'emails',
            displayName: 'E-Mail',
            displayNameI18N: { 'de': 'E-Mail' },
            props: { minItems: 0 }
        }},
    });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, props: {
            type: 'SaneString',
            key: 'roomInfo',
            displayName: 'Room Info',
            displayNameI18N: { 'de': 'Raum Info' },
            props: { minLength: 0 }
        }},
    });
 
    await driver.sendMessage({
        type: `custom-record-types/commit-settings`,
        payload: { id: crtId }
    });


    await driver.sendMessage({
        type: `custom-record-types/set-record-label-definition`,
        payload: { id: crtId, props: {
            format: '${#}',
            tokens: [
                '/state/custom/address',
            ]
        }}
    });

    await driver.sendMessage({
        type: `custom-record-types/set-display-fields`,
        payload: {
            id: crtId,
            target: 'table',
            fieldPointers: [
                '/sequenceNumber',
                '/state/custom/name',
                '/state/custom/address',
                '/state/custom/head',
                '/state/custom/phones',
            ]
        }
    });
    
    await driver.sendMessage({
        type: `custom-record-types/set-display-fields`,
        payload: {
            id: crtId,
            target: 'optionlist',
            fieldPointers: [
                '/sequenceNumber',
                '/state/custom/address',
            ]
        }
    });

    await driver.sendMessage({
        type: `custom-record-types/set-general-data`,
        payload: {
            id: crtId,
            reservationType: 'away-team',
            label: 'After-School Care Centers',
            displayNameI18N: { 'de': 'Horte' }
        }
    });

    return crtId;
}
