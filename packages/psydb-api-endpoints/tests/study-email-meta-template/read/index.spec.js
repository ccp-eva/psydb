'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { ApiError } = require('@mpieva/psydb-api-lib');
var endpoints = require('../../../src');

var endpoint = endpoints.studyEmailMetaTemplate.read;

describe('study-email-meta-template/read', function () {
    var db, ids, catLabId, otherId;
    before(async function () {
        ids = await this.restore([
            'init-minimal',
            'tiny_2026-10-22__1635__cats-01-helper-sets-and-crts',
            'tiny_2026-10-22__1635__cats-02-roles-and-research-groups',
            'tiny_2026-10-22__1635__cats-03-personnel',
            'tiny_2026-10-22__1635__cats-04-orgs-and-locations',
            'tiny_2026-10-22__1635__cats-05-subjects',
        ], { gatherIds: true });
        db = this.getDbHandle();

        var createDoc = ({ _id, templateName, researchGroupId }) => ({
            _id,
            studyType: 'catStudy',
            subjectType: 'cat',
            state: {
                templateName,
                mailSubject: `${templateName} Subject`,
                mailSender: 'sender@example.com',
                mailText: '',
                mailHTML: '<p>Foo</p>',
                mailAttachments: [],
                mailLinks: [],
                isEnabled: true,
                systemPermissions: {
                    accessRightsByResearchGroup: [
                        { researchGroupId, permission: 'read' }
                    ],
                    isHidden: false
                },
            }
        });

        catLabId = new ObjectId();
        otherId = new ObjectId();
        await db.collection('studyEmailMetaTemplate').insertMany([
            createDoc({
                _id: catLabId, templateName: 'Cat-Lab',
                researchGroupId: ids('Cat-Lab'),
            }),
            createDoc({
                _id: otherId, templateName: 'Other Group',
                researchGroupId: new ObjectId(),
            }),
        ]);
    });

    var read = async (context, email, studyEmailMetaTemplateId) => {
        var session = await context.createFakeSession(email);
        var koaContext = context.createKoaContext({
            ...session,
            request: {
                headers: { language: 'en', locale: 'en', timezone: 'UTC' },
                body: { studyEmailMetaTemplateId: String(studyEmailMetaTemplateId) }
            }
        });

        await endpoint(koaContext, async () => {});
        return koaContext.body.data;
    }

    var expectApiError = async (promise, statusCode) => {
        var error = undefined;
        try {
            await promise;
        }
        catch (e) {
            if (!(e instanceof ApiError)) {
                throw e;
            }
            error = e;
        }
        expect(error?.getInfo().statusCode).to.eql(statusCode);
    }

    it('reads record with research group labels', async function () {
        var { record, related } = await read(
            this, 'cat-ra_test@example.com', catLabId
        );
        expect(record.state.templateName).to.eql('Cat-Lab');
        expect(
            related.relatedRecordLabels.researchGroup[ids('Cat-Lab')]
        ).to.eql({ _id: ids('Cat-Lab'), _recordLabel: 'Cat-Lab' });
    });

    it('throws 404 when record not accessible', async function () {
        await expectApiError(
            read(this, 'cat-ra_test@example.com', otherId), 404
        );
    });

    it('throws 403 without collection flag', async function () {
        await expectApiError(
            read(this, 'cat-scientist_test@example.com', catLabId), 403
        );
    });
});
