'use strict';
var chai = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');

var { ejson, jsonify } = require('@mpieva/psydb-core-utils');
var { ObjectId, aggregateOne } = require('@mpieva/psydb-mongo-adapter');

var RootHandler = require('../../src/');

describe('custom-record-types/full-create-flow', function () {
    var db, login;
    beforeEach(async function () {
        await this.restore('init-minimal');
        
        db = this.getDbHandle();
        login = await this.createFakeLogin({ email: 'root@example.com' });
    });

    it('can create experiment', async function () {
        var [ sendMessage ] = this.createMessenger({ RootHandler, ...login });

        var deltas = BaselineDeltas();
        deltas.push(await this.fetchAllRecords('customRecordType'));

        var koaContext = await sendMessage({
            type: 'custom-record-types/create',
            timezone: 'Europe/Berlin',
            payload: jsonify({
                collection: 'subject',
                type: 'cats',
                props: {
                    label: 'Cats',
                    displayNameI18N: { 'de': 'Katzen' }
                },
            })
        });

        var [{ channelId: crtId }] = koaContext.response.body.data;
        deltas.push(await this.fetchAllRecords('customRecordType'));
        deltas.test({ expected: [{
            '_id': BaselineDeltas.AnyObjectId(),
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'collection': 'subject',
            'type': 'cats',
            'state': {
                'isDirty': true,
                'isNew': true,
                
                'showOnlineId': true,
                'showSequenceNumber': true,
                'requiresTestingPermissions': true,
                'commentFieldIsSensitive': false,
                
                'label': 'Cats',
                'displayNameI18N': { de: 'Katzen' },
                
                'recordLabelDefinition': {
                    format: '${#}',
                    tokens: [ { systemType: 'Id', dataPointer: '/_id' } ]
                },
                'settings': { subChannelFields: {
                    gdpr: [], scientific: []
                }},
                'nextSettings': { subChannelFields: {
                    gdpr: [], scientific: []
                }},
                'formOrder': [],
                'tableDisplayFields': [],
                'optionListDisplayFields': [],
                
                'selectionRowDisplayFields': [],
                'selectionSummaryDisplayFields': [],
                'awayTeamSelectionRowDisplayFields': [],
                'inviteConfirmationSummaryDisplayFields': [],
            }
        }], asFlatEJSON: true });
        
        await sendMessage({
            type: 'custom-record-types/set-general-data',
            timezone: 'Europe/Berlin',
            payload: jsonify({
                id: crtId,
                label: 'Cats',
                displayNameI18N: { 'de': 'Katzen' },
                showSequenceNumber: false,
                showOnlineId: false,
                requiresTestingPermissions: false,
                commentFieldIsSensitive: false,
            })
        });
        
        
        deltas.push(await this.fetchAllRecords('customRecordType'));
        deltas.test({ expected: [{
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'state': {
                'showOnlineId': false,
                'showSequenceNumber': false,
                'requiresTestingPermissions': false,
            }
        }], asFlatEJSON: true });
        
        await sendMessage({
            type: 'custom-record-types/add-field-definition',
            timezone: 'Europe/Berlin',
            payload: jsonify({
                id: crtId,
                subChannelKey: 'gdpr',
                props: {
                    key: 'studyBookId',
                    type: 'SaneString',
                    displayName: 'Study Book ID',
                    displayNameI18N: { 'de': 'Studien Buch ID' },
                    props: { minLength: 1 }
                }
            })
        });

        deltas.push(await this.fetchAllRecords('customRecordType'));
        deltas.test({ expected: [{
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'state': { 'nextSettings': { 'subChannelFields': { 'gdpr': [{
                key: 'studyBookId',
                type: 'SaneString',
                displayName: 'Study Book ID',
                displayNameI18N: { de: 'Studien Buch ID' },
                props: { minLength: 1 },
                pointer: '/gdpr/state/custom/studyBookId',
                isNew: true,
                isDirty: true
            }] }}}
        }], asFlatEJSON: true });
        
        console.dir(ejson(deltas.getCurrent()), { depth: null });
    });
})

