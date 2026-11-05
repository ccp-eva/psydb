'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS, PROPS_AS_STATE }
    = require('@mpieva/psydb-api-mocha-test-tools/utils');

describe('study-email-meta-template/[create|update] flow', function () {
    var db, ids, send;
    before(async function () {
        ids = await this.restore([
            'init-cats-with-data-small'
        ], { gatherIds: true });
        
        db = this.getDbHandle();
        ([ send ] = this.createMessenger({
            login: { email: 'root@example.com' }
        }));
    });

    step('create', async function () {
        var deltas = BaselineDeltas();
        deltas.push(await this.fetchAllRecords('studyEmailMetaTemplate'));

        var payload = {
            'studyType': 'catStudy',
            'subjectType': 'cat',
            'props': {
                'templateName': 'Default Email Meta Template',
                'isEnabled': true,
                'mailSubject': 'Studien-Einladung',
                'mailSender': 'study-sender-email@example.com',
                'mailText': '',
                'mailHTML': '<p>Foo</p><p>Bar</p><p>{{ link.0 }}</p>',
                'mailAttachments': [],
                'mailLinks': [ 'http://example.com' ],
                'systemPermissions': {
                    'accessRightsByResearchGroup': [{
                        'researchGroupId': ids('Cat-Lab'),
                        'permission': 'write'
                    }],
                    'isHidden': false,
                },
            }
        }

        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'study-email-meta-template/create',
            timezone: 'Europe/Berlin',
            payload: payload
        }));

        deltas.push(await this.fetchAllRecords('studyEmailMetaTemplate'));
        deltas.test({ expected: [{
            '_id': channelId,
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            ...PROPS_AS_STATE(payload),
        }], asFlatEJSON: true });
    })

    step('update', async function () {
        await ids.update();
        
        var deltas = BaselineDeltas();
        deltas.push(await this.fetchAllRecords('studyEmailMetaTemplate'));

        var studyEmailMetaTemplateId = ids('Default Email Meta Template');
        var payload = {
            '_id': studyEmailMetaTemplateId,
            'props': {
                'templateName': 'Default Email Meta Template UPDATED',
                'isEnabled': true,
                'mailSubject': 'Einladung zur FOO-Studie',
                'mailSender': 'study-sender-email@example.com',
                'mailText': '',
                'mailHTML': '<p>Foo</p><p>Bar</p><p>{{ link.0 }}</p>',
                'mailAttachments': [],
                'mailLinks': [ 'http://example.com' ],
                'systemPermissions': {
                    'accessRightsByResearchGroup': [{
                        'researchGroupId': ids('Cat-Lab'),
                        'permission': 'write'
                    }],
                    'isHidden': false,
                },
            }
        }
        
        await send({
            type: 'study-email-meta-template/patch',
            timezone: 'Europe/Berlin',
            payload: payload
        });
        
        deltas.push(await this.fetchAllRecords('studyEmailMetaTemplate'));
        deltas.test({ expected: { '0': {
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'state': {
                'templateName': 'Default Email Meta Template UPDATED',
                'mailSubject': 'Einladung zur FOO-Studie'
            }
        }}, asFlatEJSON: true });
    })
})
