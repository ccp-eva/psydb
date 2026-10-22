'use strict';
var { expect } = require('chai');
var Koa = require('koa');
var supertest = require('supertest');

var { Permissions } = require('@mpieva/psydb-common-lib');
var { Self } = require('@mpieva/psydb-api-lib');
var withApiErrors = require('../../../src/middleware/errors');
var upload = require('../../../src/endpoints/entities/file/upload');

describe('endpoints/file/upload permissions', function () {
    var db;
    before(async function () {
        await this.restore([
            'init-minimal',
            'tiny_2026-10-22__1635__cats-01-helper-sets-and-crts',
            'tiny_2026-10-22__1635__cats-02-roles-and-research-groups',
            'tiny_2026-10-22__1635__cats-03-personnel',
            'tiny_2026-10-22__1635__cats-04-orgs-and-locations',
            'tiny_2026-10-22__1635__cats-05-subjects',
        ]);
        db = this.getDbHandle();
    });

    // NOTE: mounting the endpoint alone with a faked login
    var uploadAs = async (email) => {
        var self = await Self({ db, query: {
            'gdpr.state.emails.email': email
        }});
        var permissions = Permissions.fromSelf({ self });

        var app = new Koa();
        app.use(withApiErrors());
        app.use(async (context, next) => {
            Object.assign(context, { db, self, permissions });
            await upload(context, next);
        });

        return supertest(app.callback()).post('/').attach(
            'file', Buffer.from('%PDF-1.4 fake'), 'info.pdf'
        );
    }

    it('allows users with meta template write flag', async function () {
        var response = await uploadAs('cat-ra_test@example.com');
        expect(response.status).to.eql(200);

        var [ record ] = response.body.data.records;
        expect(record.originalFilename).to.eql('info.pdf');

        var ra = await db.collection('personnel').findOne({
            'gdpr.state.emails.email': 'cat-ra_test@example.com'
        });
        var stored = await db.collection('file').findOne({
            originalFilename: 'info.pdf', createdBy: ra._id
        });
        expect(stored).to.exist;
    });

    it('denies users without meta template write flag', async function () {
        var response = await uploadAs('cat-scientist_test@example.com');
        expect(response.status).to.eql(403);
    });
});
