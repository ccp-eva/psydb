'use strict';

var createSubjectCRT = async (bag) => {
    var {
        apiKey,
        driver,
        site,
        ethnologySetId,
        formOrder
    } = bag;

    var label = `FS ${site.labelEN} Subjects`;
    var displayNameI18N = {
        de: `FS ${site.labelDE} Proband:innen`,
    }

    await driver.sendMessage({
        type: `custom-record-types/create`,
        payload: {
            collection: 'subject',
            type: `fs_${site.type}_subject`,
            props: { label, displayNameI18N }
        },
    }, { apiKey });

    var crtId = driver.getCache().lastChannelIds['customRecordType'];

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'gdpr', props: {
            type: 'SaneString',
            key: 'name',
            displayName: 'Name',
            displayNameI18N: { de: 'Name' },
            props: { minLength: 1 }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'BiologicalGender',
            key: 'biologicalGender',
            displayName: 'Gender',
            displayNameI18N: { 'de': 'Geschlecht' },
            props: {
                enableUnknownValue: true,
                enableOtherValue: false,
            }
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'DateOnlyServerSide',
            key: 'dateOfBirth',
            displayName: 'Date of Birth',
            displayNameI18N: { de: 'Geburtsdatum' },
            props: { isNullable: false, isSpecialAgeFrameField: true }
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'DefaultBool',
            key: 'isDateOfBirthReliable',
            displayName: 'Date of Birth Reliable',
            displayNameI18N: { de: 'Geburtsdatum gesichert' },
            props: {},
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'HelperSetItemId',
            key: 'ethnologyId',
            displayName: 'Ethnology',
            displayNameI18N: { de: 'Ethnie' },
            props: {
                setId: ethnologySetId,
                isNullable: true,
                displayEmptyAsUnknown: true,
            },
        }},
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/add-field-definition`,
        payload: { id: crtId, subChannelKey: 'scientific', props: {
            type: 'ForeignId',
            key: 'mainLocationId',
            displayName: 'Main Location',
            displayNameI18N: { de: 'Haupt-Location' },
            props: {
                collection: 'location',
                recordType: `fs_${site.type}_location`,
                isNullable: true,
                displayEmptyAsUnknown: true,
                addReferenceToTarget: false,
                constraints: {},
            },
        }},
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/commit-settings`,
        payload: { id: crtId }
    }, { apiKey });


    await driver.sendMessage({
        type: `custom-record-types/set-record-label-definition`,
        payload: { id: crtId, props: {
            format: '${#} (ID: ${#})',
            tokens: [
                '/gdpr/state/custom/name',
                '/sequenceNumber'
            ]
        }}
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/set-display-fields`,
        payload: {
            id: crtId,
            target: 'table',
            fieldPointers: [
                '/sequenceNumber',
                '/gdpr/state/custom/name',
                '/scientific/state/custom/dateOfBirth',
            ]
        }
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/set-display-fields`,
        payload: {
            id: crtId,
            target: 'optionlist',
            fieldPointers: [
                '/sequenceNumber',
                '/gdpr/state/custom/name',
                '/scientific/state/custom/dateOfBirth',
            ]
        }
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/set-form-order`,
        payload: { id: crtId, formOrder }
    }, { apiKey });

    return crtId;
}

module.exports = createSubjectCRT
