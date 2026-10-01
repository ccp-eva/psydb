'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS, PROPS_AS_STATE }
    = require('@mpieva/psydb-api-mocha-test-tools/utils');

describe('study-email-template/[create|update] flow', function () {
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
        deltas.push(await this.fetchAllRecords('studyEmailTemplate'));

        var payload = {
            'studyId': ids(/IH-Study/),
            'subjectType': 'child',
            'props': {
                'templateName': 'Default Email Template',
                'isEnabled': true,
                'mailSubject': 'Studien-Einladung',
                'mailSender': 'study-sender-email@example.com',
                'mailText': "Foo\nBar\n{{ link.0 }}",
                'mailHTML': '<p>Foo</p><p>Bar</p><p>{{ link.0 }}</p>',
                'mailAttachments': [],
                'mailLinks': [ 'http://example.com' ],
            }
        }

        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'study-email-template/create',
            timezone: 'Europe/Berlin',
            payload: payload
        }));

        deltas.push(await this.fetchAllRecords('studyEmailTemplate'));
        deltas.test({ expected: [{
            '_id': channelId,
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            ...PROPS_AS_STATE(payload),
        }], asFlatEJSON: true });
    })

    step('update', async function () {
        await ids.update();
        
        var deltas = BaselineDeltas();
        deltas.push(await this.fetchAllRecords('studyEmailTemplate'));

        var studyEmailTemplateId = ids('Default Email Template');
        var payload = {
            '_id': studyEmailTemplateId,
            'props': {
                'templateName': 'Default Email Template UPDATED',
                'isEnabled': true,
                'mailSubject': 'Einladung zur FOO-Studie',
                'mailSender': 'study-sender-email@example.com',
                'mailText': "Foo\nBar\n{{ link.0 }}",
                'mailHTML': '<p>Foo</p><p>Bar</p><p>{{ link.0 }}</p>',
                'mailAttachments': [],
                'mailLinks': [ 'http://example.com' ],
            }
        }
        
        await send({
            type: 'study-email-template/patch',
            timezone: 'Europe/Berlin',
            payload: payload
        });
        
        deltas.push(await this.fetchAllRecords('studyEmailTemplate'));
        deltas.test({ expected: { '0': {
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'state': {
                'templateName': 'Default Email Template UPDATED',
                'mailSubject': 'Einladung zur FOO-Studie'
            }
        }}, asFlatEJSON: true });
    })
})
