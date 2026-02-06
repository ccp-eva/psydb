'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');

var { ObjectId } = require('@cdxoo/mongo-test-helpers');
var { ejson, omit, without } = require('@mpieva/psydb-core-utils');
var { ApiError, aggregateToArray } = require('@mpieva/psydb-api-lib');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);

var RootHandler = require('../../../src/');

describe('csv-import/subject/create-default fs-malaysia', function () {

    var subjectType = 'fs_malaysia_subject';
    var researchGroupId = ObjectId("64d42dd0443aa279ca4caff8");

    var db, sendMessage;
    beforeEach(async function () {
        await this.restore('2024-09-26__0717');
        
        db = this.getDbHandle();
        ([ sendMessage ] = this.createMessenger({
            RootHandler,
            ...(await this.createFakeLogin({ email: 'root@example.com' }))
        }));

    });

    it('full import with all available columns', async function () {
        var { _id: fileId } = await this.createFakeFileUpload({
            db, buffer: loadCSV('subject-import/fs-malaysia'),
        });

        var koaContext = await sendMessage({
            type: 'csv-import/subject/create-default',
            timezone: 'UTC',
            payload: jsonify({ researchGroupId, subjectType, fileId })
        });

        var { csvImportId } = koaContext.response.body.data;
        var subjects = await aggregateToArray({ db, subject: [
            { $match: { csvImportId }},
        ]});
        expect(subjects.length).to.eql(2);
        expect(ejson(subjects[0].gdpr.state)).to.eql({
            custom: { name: 'Bob' }
        });
        expect(ejson(subjects[1].gdpr.state)).to.eql({
            custom: { name: 'Alice' }
        });
        
        expect(ejson(subjects[0].scientific.state.custom.dateOfBirth))
            .to.eql({ $date: '2012-12-29T00:00:00.000Z' });
        expect(ejson(subjects[1].scientific.state.custom.dateOfBirth))
            .to.eql({ $date: '2012-11-29T00:00:00.000Z' });
    });
    
    it('full import with all only required columns', async function () {
        var { _id: fileId } = await this.createFakeFileUpload({ db, buffer: (
            loadCSV('subject-import/fs-malaysia-only-required-columns')
        )});

        var koaContext = await sendMessage({
            type: 'csv-import/subject/create-default',
            timezone: 'UTC',
            payload: jsonify({ researchGroupId, subjectType, fileId })
        });

        var { csvImportId } = koaContext.response.body.data;
        var subjects = await aggregateToArray({ db, subject: [
            { $match: { csvImportId }},
        ]});
        expect(subjects.length).to.eql(2);
        expect(ejson(subjects[0].gdpr.state)).to.eql({
            custom: { name: 'Bob' }
        });
        expect(ejson(subjects[1].gdpr.state)).to.eql({
            custom: { name: 'Alice' }
        });
    });

    it('throws on missing required columns', async function () {
        var { _id: fileId } = await this.createFakeFileUpload({ db, buffer: (
            loadCSV('subject-import/fs-malaysia-missing-required-columns')
        )});
       
        var apiError = undefined;
        try {
            await sendMessage({
                type: 'csv-import/subject/create-default',
                timezone: 'UTC',
                payload: jsonify({ researchGroupId, subjectType, fileId })
            });
        }
        catch (e) {
            if (!(e instanceof ApiError)) {
                throw e;
            }

            var info = e.getInfo();
            expect(info.apiStatus).to.eql('NoSubjectsAreImportable');
        }
    });
    
    it('partial import on missing required value', async function () {
        var { _id: fileId } = await this.createFakeFileUpload({ db, buffer: (
            loadCSV('subject-import/fs-malaysia-missing-required-value')
        )});
        
        var koaContext = await sendMessage({
            type: 'csv-import/subject/create-default',
            timezone: 'UTC',
            payload: jsonify({ researchGroupId, subjectType, fileId })
        });
        
        var { csvImportId } = koaContext.response.body.data;
        var subjects = await aggregateToArray({ db, subject: [
            { $match: { csvImportId }},
        ]});
        expect(subjects.length).to.eql(1);
        expect(ejson(subjects[0].gdpr.state)).to.eql({
            custom: { name: 'Bob' }
        });
    });
    
    it('throws on missnamed column', async function () {
        var { _id: fileId } = await this.createFakeFileUpload({ db, buffer: (
            loadCSV('subject-import/fs-malaysia-misnamed-column')
        )});
        
        var apiError = undefined;
        try {
            await sendMessage({
                type: 'csv-import/subject/create-default',
                timezone: 'UTC',
                payload: jsonify({ researchGroupId, subjectType, fileId })
            });
        }
        catch (e) {
            if (!(e instanceof ApiError)) {
                throw e;
            }

            var info = e.getInfo();
            expect(info.apiStatus).to.eql('NoSubjectsAreImportable');
            //console.log(e.getInfo());
        }
    });
    
    it('partial import on invalid hsi ref', async function () {
        var { _id: fileId } = await this.createFakeFileUpload({ db, buffer: (
            loadCSV('subject-import/fs-malaysia-invalid-hsi-ref')
        )});
        
        var koaContext = await sendMessage({
            type: 'csv-import/subject/create-default',
            timezone: 'UTC',
            payload: jsonify({ researchGroupId, subjectType, fileId })
        });
        
        var { csvImportId } = koaContext.response.body.data;
        var subjects = await aggregateToArray({ db, subject: [
            { $match: { csvImportId }},
        ]});
        expect(subjects.length).to.eql(1);
        expect(ejson(subjects[0].gdpr.state)).to.eql({
            custom: { name: 'Alice' }
        });
    });
    
    it('works when HSI is found twice (same en/de)', async function () {
        var { _id: fileId } = await this.createFakeFileUpload({
            db, buffer: loadCSV('subject-import/fs-malaysia-hsi-temiar'),
        });

        var koaContext = await sendMessage({
            type: 'csv-import/subject/create-default',
            timezone: 'UTC',
            payload: jsonify({ researchGroupId, subjectType, fileId })
        });

        var { csvImportId } = koaContext.response.body.data;
        var subjects = await aggregateToArray({ db, subject: [
            { $match: { csvImportId }},
        ]});
        expect(subjects.length).to.eql(2);
        expect(ejson(subjects[0].gdpr.state)).to.eql({
            custom: { name: 'Bob' }
        });
        expect(ejson(subjects[1].gdpr.state)).to.eql({
            custom: { name: 'Alice' }
        });
    });

    it('coerces bool types', async function () {
        var { _id: fileId } = await this.createFakeFileUpload({
            db, buffer: loadCSV('subject-import/fs-malaysia-coerce-bool'),
        });

        var koaContext = await sendMessage({
            type: 'csv-import/subject/create-default',
            timezone: 'UTC',
            payload: jsonify({ researchGroupId, subjectType, fileId })
        });

        var { csvImportId } = koaContext.response.body.data;
        var subjects = await aggregateToArray({ db, subject: [
            { $match: { csvImportId }},
        ]});
        expect(subjects.length).to.eql(3);
        expect(ejson(subjects[0].gdpr.state)).to.eql({
            custom: { name: 'Bob' }
        });
        expect(ejson(subjects[1].gdpr.state)).to.eql({
            custom: { name: 'Alice' }
        });
        expect(ejson(subjects[2].gdpr.state)).to.eql({
            custom: { name: 'Eve' }
        });
    });

    it('accepts short dates', async function () {
        var { _id: fileId } = await this.createFakeFileUpload({
            db, buffer: loadCSV('subject-import/fs-malaysia-short-date'),
        });

        var koaContext = await sendMessage({
            type: 'csv-import/subject/create-default',
            timezone: 'UTC',
            payload: jsonify({ researchGroupId, subjectType, fileId })
        });

        var { csvImportId } = koaContext.response.body.data;
        var subjects = await aggregateToArray({ db, subject: [
            { $match: { csvImportId }},
        ]});
        expect(subjects.length).to.eql(2);
        expect(ejson(subjects[0].scientific.state.custom.dateOfBirth))
            .to.eql({ $date: '2012-12-29T00:00:00.000Z' });
        expect(ejson(subjects[1].scientific.state.custom.dateOfBirth))
            .to.eql({ $date: '2012-11-29T00:00:00.000Z' });
    });

    it.skip('full import with 1000 lines', async function () {
        var { _id: fileId } = await this.createFakeFileUpload({ db, buffer: (
            loadCSV('subject-import/fs-malaysia-1000-subjects')
        )});

        await sendMessage({
            type: 'csv-import/subject/create-default',
            timezone: 'UTC',
            payload: jsonify({ researchGroupId, subjectType, fileId })
        });
    });
})
