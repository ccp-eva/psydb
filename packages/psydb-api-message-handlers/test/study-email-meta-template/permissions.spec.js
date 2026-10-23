'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { KOA_CHANNELS } = require('@mpieva/psydb-api-mocha-test-tools/utils');
var { ApiError } = require('@mpieva/psydb-api-lib');

describe('study-email-meta-template permissions', function () {
    var db, ids, sendAsRoot, sendAsRA, sendAsScientist;
    before(async function () {
        ids = await this.restore([
            'init-minimal',
            'tiny_2026-10-23__0312__cats-01-helper-sets-and-crts',
            'tiny_2026-10-23__0312__cats-02-roles-and-research-groups',
            'tiny_2026-10-23__0312__cats-03-personnel',
            'tiny_2026-10-23__0312__cats-04-orgs-and-locations',
            'tiny_2026-10-23__0312__cats-05-subjects',
        ], { gatherIds: true });

        db = this.getDbHandle();
        // NOTE: in the fixture 'Cat RA' has the meta template flags
        // while 'Cat Scientist' does not

        ([ sendAsRoot ] = this.createMessenger({
            login: { email: 'root@example.com' }
        }));
        ([ sendAsRA ] = this.createMessenger({
            login: { email: 'cat-ra_test@example.com' }
        }));
        ([ sendAsScientist ] = this.createMessenger({
            login: { email: 'cat-scientist_test@example.com' }
        }));
    });

    var createProps = ({ templateName, permission }) => ({
        'templateName': templateName,
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
                'permission': permission
            }],
            'isHidden': false,
        },
    });

    var create = (send, bag) => KOA_CHANNELS(send({
        type: 'study-email-meta-template/create',
        timezone: 'Europe/Berlin',
        payload: {
            'studyType': 'catStudy',
            'subjectType': 'cat',
            'props': createProps(bag),
        }
    }));

    var patch = (send, _id, bag) => send({
        type: 'study-email-meta-template/patch',
        timezone: 'Europe/Berlin',
        payload: { _id, 'props': createProps(bag) }
    });

    var expect403 = async (promise) => {
        var apiError = undefined;
        try {
            await promise;
        }
        catch (e) {
            if (!(e instanceof ApiError)) {
                throw e;
            }
            apiError = e;
        }
        expect(apiError?.getInfo().statusCode).to.eql(403);
    }

    step('create denied without collection flag', async function () {
        await expect403(create(sendAsScientist, {
            templateName: 'Scientist Template', permission: 'write'
        }));
    });

    step('create allowed with collection flag', async function () {
        var [{ channelId }] = await create(sendAsRA, {
            templateName: 'RA Template', permission: 'write'
        });
        expect(channelId).to.be.ok;
    });

    step('patch allowed with record write access', async function () {
        await ids.update();
        await patch(sendAsRA, ids('RA Template'), {
            templateName: 'RA Template UPDATED', permission: 'write'
        });
    });

    step('patch denied with record read access only', async function () {
        var [{ channelId }] = await create(sendAsRoot, {
            templateName: 'Read Only Template', permission: 'read'
        });
        await expect403(patch(sendAsRA, channelId, {
            templateName: 'Read Only Template UPDATED', permission: 'read'
        }));
    });

    step('patch denied without collection flag', async function () {
        await ids.update();
        await expect403(patch(sendAsScientist, ids('RA Template UPDATED'), {
            templateName: 'Scientist Was Here', permission: 'write'
        }));
    });
})
