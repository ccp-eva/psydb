'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { ApiError } = require('@mpieva/psydb-api-lib');
var endpoints = require('../../../src');

var endpoint = endpoints.studyEmailMetaTemplate.list;

describe('study-email-meta-template/list', function () {
    var db, ids;
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

        var createDoc = ({ templateName, accessRightsByResearchGroup }) => ({
            _id: new ObjectId(),
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
                    accessRightsByResearchGroup,
                    isHidden: false
                },
            }
        });

        await db.collection('studyEmailMetaTemplate').insertMany([
            createDoc({ templateName: 'Cat-Lab Read', accessRightsByResearchGroup: [
                { researchGroupId: ids('Cat-Lab'), permission: 'read' }
            ]}),
            createDoc({ templateName: 'Cat-Lab Write', accessRightsByResearchGroup: [
                { researchGroupId: ids('Cat-Lab'), permission: 'write' }
            ]}),
            createDoc({ templateName: 'Other Group', accessRightsByResearchGroup: [
                { researchGroupId: new ObjectId(), permission: 'write' }
            ]}),
        ]);
    });

    var list = async (context, email, quicksearch = {}) => {
        var session = await context.createFakeSession(email);
        var koaContext = context.createKoaContext({
            ...session,
            request: {
                headers: { language: 'en', locale: 'en', timezone: 'UTC' },
                body: {
                    quicksearch,
                    offset: 0,
                    limit: 1000,
                    sort: { path: '/state/templateName', direction: 'asc' },
                }
            }
        });

        await endpoint(koaContext, async () => {});
        return koaContext.body.data;
    }

    it('lists all records for root', async function () {
        var { records, recordsCount } = await list(this, 'root@example.com');
        expect(recordsCount).to.eql(3);
        expect(records.map(it => it.state.templateName)).to.eql([
            'Cat-Lab Read', 'Cat-Lab Write', 'Other Group'
        ]);
    });

    it('lists only records readable by own research groups', async function () {
        var { records, recordsCount } = await list(
            this, 'cat-ra_test@example.com'
        );
        expect(recordsCount).to.eql(2);
        expect(records.map(it => it.state.templateName)).to.eql([
            'Cat-Lab Read', 'Cat-Lab Write'
        ]);
    });

    it('returns zero count when nothing matches', async function () {
        var { records, recordsCount } = await list(
            this, 'root@example.com', { '/state/templateName': 'NOPE' }
        );
        expect(recordsCount).to.eql(0);
        expect(records).to.eql([]);
    });

    it('throws 403 without collection flag', async function () {
        var error = undefined;
        try {
            await list(this, 'cat-scientist_test@example.com');
        }
        catch (e) {
            if (!(e instanceof ApiError)) {
                throw e;
            }
            error = e;
        }
        expect(error?.getInfo().statusCode).to.eql(403);
    });
});
