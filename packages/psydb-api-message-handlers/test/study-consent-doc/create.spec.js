'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS, PROPS_AS_STATE }
    = require('@mpieva/psydb-api-mocha-test-tools/utils');

var { jsonify } = require('@mpieva/psydb-core-utils');
var { ObjectId, aggregateOne } = require('@mpieva/psydb-mongo-adapter');
var { ApiError } = require('@mpieva/psydb-api-lib');

describe('study-consent-doc/create', function () {
    var db, ids, send;
    before(async function () {
        ids = await this.restore([
            'tiny_2026-01-28__0437__consent-doc-starter',
        ], { gatherIds: true });
        
        db = this.getDbHandle();
        ([ send ] = this.createMessenger({
            login: { email: 'root@example.com' }
        }));
    });

    step('create', async function () {
        var deltas = BaselineDeltas();
        deltas.push(await this.fetchAllRecords('studyConsentDoc'));

        var payload = {
            'studyConsentFormId': ids(/Tiny-Test/),
            'subjectId': ids(/Test Kind, Alice/),
            'labOperatorIds': [ ids(/ROOT/) ],
            'consentObtainedBy': ids(/ROOT/),
            'props': {
                'elementValues': {
                    '2': 'Test Parent, Elenor',
                    '3': 'Alice',
                    '4': 'Test Kind',
                    '6': true
                }
            }
        }

        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'study-consent-doc/create',
            timezone: 'Europe/Berlin',
            payload: payload
        }));

        deltas.push(await this.fetchAllRecords('studyConsentDoc'));
        var studyConsentFormSnapshot = await (
            aggregateOne({ db, studyConsentForm: { '_id': ids(/Tiny-Test/) }})
        );
        deltas.test({ expected: {
            '/0/_id': channelId,
            '/0/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/0/studyId': ids(/IH-Study/),
            '/0/studyConsentFormId': ids(/Tiny-Test/),
            '/0/subjectId': ids(/Test Kind, Alice/),
            '/0/personnelId': ids(/ROOT/),
            '/0/labOperatorIds': [ ids(/ROOT/) ],
            '/0/consentObtainedBy': ids(/ROOT/),
            '/0/subjectType': 'child',
            '/0/state': {
                ...PROPS_AS_STATE(payload).state,
                'studyConsentFormSnapshot': studyConsentFormSnapshot,
            }
        }, asFlatEJSON: true });
    })
})

describe('study-consent-doc/create (ForeignId subject field)', function () {
    var db, ids, send;
    before(async function () {
        ids = await this.restore([
            'tiny_2026-01-28__0437__consent-doc-starter',
        ], { gatherIds: true });
        
        db = this.getDbHandle();
        ([ send ] = this.createMessenger({
            login: { email: 'root@example.com' }
        }));

        var studyConsentForm = await aggregateOne({ db, studyConsentForm: {
            '_id': ids(/Tiny-Test/)
        }});
        var { elements, ...pass } = studyConsentForm.state;
        await KOA_CHANNELS(send({
            type: 'study-consent-form/patch',
            timezone: 'Europe/Berlin',
            payload: {
                'studyConsentFormId': ids(/Tiny-Test/),
                'props': { ...pass, 'elements': [
                    ...elements,
                    {
                        'type': 'subject-field',
                        'pointer': '/scientific/state/custom/kigaId',
                        'isRequired': true,
                    },
                ]}
            }
        }));
    });

    var createPayload = (kigaLabel) => ({
        'studyConsentFormId': ids(/Tiny-Test/),
        'subjectId': ids(/Test Kind, Alice/),
        'labOperatorIds': [ ids(/ROOT/) ],
        'consentObtainedBy': ids(/ROOT/),
        'props': {
            'elementValues': {
                '2': 'Test Parent, Elenor',
                '3': 'Alice',
                '4': 'Test Kind',
                '6': true,
                '7': kigaLabel,
            }
        }
    });

    step('stores foreign id subject field as plain string', async function () {
        var payload = createPayload('Some Kiga (renamed)');
        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'study-consent-doc/create',
            timezone: 'Europe/Berlin',
            payload,
        }));

        var doc = await aggregateOne({ db, studyConsentDoc: {
            '_id': channelId
        }});
        expect(doc.state.elementValues['7']).to.eql('Some Kiga (renamed)');
    });

    step('rejects empty string when required', async function () {
        var apiError = undefined;
        try {
            await send({
                type: 'study-consent-doc/create',
                timezone: 'Europe/Berlin',
                payload: createPayload(''),
            });
        }
        catch (e) {
            if (!(e instanceof ApiError)) {
                throw e;
            }
            apiError = e;
        }
        expect(apiError?.getInfo().apiStatus).to.eql('InvalidMessageSchema');
    });

    step('rejects missing consentObtainedBy', async function () {
        var { consentObtainedBy, ...payload } = createPayload('Some Kiga');
        var apiError = undefined;
        try {
            await send({
                type: 'study-consent-doc/create',
                timezone: 'Europe/Berlin',
                payload,
            });
        }
        catch (e) {
            if (!(e instanceof ApiError)) {
                throw e;
            }
            apiError = e;
        }
        expect(apiError?.getInfo().apiStatus).to.eql('InvalidMessageSchema');
    });
})
