'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS, PROPS_AS_STATE }
    = require('@mpieva/psydb-api-mocha-test-tools/utils');

var { jsonify } = require('@mpieva/psydb-core-utils');
var { ObjectId, aggregateOne } = require('@mpieva/psydb-mongo-adapter');

describe('study-consent-form/[create|update] flow', function () {
    var db, ids, send;
    before(async function () {
        ids = await this.restore([
            'tiny_2025-11-21__0632__consent-flow-starter'
        ], { gatherIds: true });
        
        db = this.getDbHandle();
        ([ send ] = this.createMessenger({
            login: { email: 'root@example.com' }
        }));
    });

    step('create', async function () {
        var deltas = BaselineDeltas();
        deltas.push(await this.fetchAllRecords('studyConsentForm'));

        var payload = {
            'studyId': ids(/IH-Study/),
            'subjectType': 'child',
            'props': {
                'internalName': 'Default Consent Form',
                'title': 'Einwilligung zur Studienteilnahme',
                'isEnabled': true,
                'elements': [ ...elements ]
            }
        }

        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'study-consent-form/create',
            timezone: 'Europe/Berlin',
            payload: payload
        }));

        deltas.push(await this.fetchAllRecords('studyConsentForm'));
        deltas.test({ expected: [{
            '_id': channelId,
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            ...PROPS_AS_STATE(payload),
        }], asFlatEJSON: true });
    })

    step('update', async function () {
        await ids.update();
        
        var deltas = BaselineDeltas();
        deltas.push(await this.fetchAllRecords('studyConsentForm'));

        var studyConsentFormId = ids('Default Consent Form');
        var payload = {
            'studyConsentFormId': studyConsentFormId,
            'props': {
                'internalName': 'Default Consent Form UPDATED',
                'title': 'Einwilligung zur Studienteilnahme',
                'isEnabled': true,
                'elements': [ ...elements, {
                    type: 'extra-field',
                    systemType: 'DefaultBool',
                    displayName: 'ADDED FIELD',
                    displayNameI18N: { 'de': 'ZUSATZ FIELD' },
                    isRequired: false,
                }]
            }
        }
        
        await send({
            type: 'study-consent-form/patch',
            timezone: 'Europe/Berlin',
            payload: payload
        });
        
        deltas.push(await this.fetchAllRecords('studyConsentForm'));
        console.log(deltas.getCurrent());
        deltas.test({ expected: { '0': {
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'state': {
                'internalName': 'Default Consent Form UPDATED',
                'elements': { '20': {
                    type: 'extra-field',
                    systemType: 'DefaultBool',
                    displayName: 'ADDED FIELD',
                    displayNameI18N: { 'de': 'ZUSATZ FIELD' },
                    isRequired: false,
                }}
            }
        }}, asFlatEJSON: true });
    })
})

var lorem = (
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'
)

var elements = [
    {
        type: 'extra-field',
        systemType: 'SaneString',
        displayName: 'Some Extra Text Field',
        displayNameI18N: { 'de': 'Ein Extra Text Feld' },
        isRequired: false,
    },
    {
        type: 'subject-field',
        pointer: '/gdpr/state/custom/firstname',
        isRequired: true,
    },
    {
        type: 'subject-field',
        pointer: '/gdpr/state/custom/lastname',
        isRequired: true,
    },
    {
        type: 'subject-field',
        pointer: '/scientific/state/custom/dateOfBirth',
        isRequired: true,
    },
    { 
        type: 'info-text-markdown',
        markdown: lorem,
        markdownI18N: {},
    },
    { type: 'hr' },
    {
        type: 'extra-field',
        systemType: 'DefaultBool',
        displayName: 'Siblings?',
        displayNameI18N: { 'de': 'Geschwister' },
        isRequired: false,
    },
    {
        type: 'extra-field',
        systemType: 'BiologicalGender',
        displayName: 'Gender',
        displayNameI18N: { 'de': 'Geschlecht' },
        isRequired: false,
    },
    {
        type: 'extra-field',
        systemType: 'DateOnlyServerSide',
        displayName: 'Date of Birth',
        displayNameI18N: { 'de': 'Geburtsdatum' },
        isRequired: false,
    },
    { type: 'hr' },
    {
        type: 'extra-field',
        systemType: 'DefaultBool',
        displayName: 'Multi Lang?',
        displayNameI18N: { 'de': 'Mehrsprachig?' },
        isRequired: false,
    },
    {
        type: 'subject-field',
        pointer: '/scientific/state/custom/languageIds',
        isRequired: false,
    },
    { type: 'hr' },
    {
        type: 'extra-field',
        systemType: 'DefaultBool',
        displayName: 'Kiga?',
        displayNameI18N: { 'de': 'Kiga?' },
        isRequired: false,
    },
    {
        type: 'extra-field',
        systemType: 'SaneString',
        displayName: 'Kiga-Name',
        displayNameI18N: { 'de': 'Kiga-Name' },
        isRequired: false,
    },
    {
        type: 'extra-field',
        systemType: 'Address',
        displayName: 'Kiga-Address',
        displayNameI18N: { 'de': 'Kiga-Anschrift' },
        isRequired: false,
    },
    { type: 'hr' },
    {
        type: 'extra-field',
        systemType: 'DefaultBool',
        displayName: 'Online?',
        displayNameI18N: { 'de': 'Online?' },
        isRequired: true,
        requiredValue: 'any',
    },
    {
        type: 'extra-field',
        systemType: 'DefaultBool',
        displayName: 'I Accept',
        displayNameI18N: { 'de': 'Ich Akzeptiere' },
        isRequired: true,
        requiredValue: true,
    },
    { 
        type: 'info-text-markdown',
        markdown: `
            # GDPR INFORMATION

            ## Headline 1
            ${lorem}

            ## Headline 2
            ${lorem}
        `.trim(),
        markdownI18N: {},
    },
]
