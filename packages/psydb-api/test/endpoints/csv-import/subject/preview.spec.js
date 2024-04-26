'use strict';
var { expect } = require('chai');
var { ejson, ObjectId } = require('@cdxoo/mongo-test-helpers');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);
var noop = async () => {};
var picard = ObjectId("6312720d8dde11df80a50aa2");

describe('endpoints/csv-import/subject/preview', function () {
    var db, agent;
    beforeEach(async function () {
        await this.connectLocal();
        
        this.createKoaApi();
        await this.signIn();

        agent = this.getApiAgent();
        db = this.getDbHandle();
    });

    afterEach(async function () {
        await this.signOut();
    });

    var headers = {
        language: 'de',
        locale: 'de',
        timezone: 'Europe/Berlin'
    }

    it('file ok', async function () {
        var file = await this.createFakeFileUpload({
            db, buffer: loadCSV('subject-import/fs-malaysia'),
        });

        var response = await (
            agent.post('/csv-import/subject/preview', jsonify({
                subjectType: 'fs_malaysia_subject',
                researchGroupId: '66051bb1c1e37e5a99ee54c3',
                fileId: file._id,
            }), { headers })
        );
        
        console.dir(ejson(response.data), { depth: null });
    })
    
    it('ok but only required columns', async function () {
        var file = await this.createFakeFileUpload({ db, buffer: loadCSV(
            'subject-import/fs-malaysia-only-required-columns'
        )});

        var response = await (
            agent.post('/csv-import/subject/preview', jsonify({
                subjectType: 'fs_malaysia_subject',
                researchGroupId: '66051bb1c1e37e5a99ee54c3',
                fileId: file._id,
            }), { headers })
        );
        
        console.dir(ejson(response.data), { depth: null });
    })
    
    it('missing required columns', async function () {
        var file = await this.createFakeFileUpload({ db, buffer: loadCSV(
            'subject-import/fs-malaysia-missing-required-columns'
        )});

        var error = undefined;
        try {
            await (
                agent.post('/csv-import/subject/preview', jsonify({
                    subjectType: 'fs_malaysia_subject',
                    researchGroupId: '66051bb1c1e37e5a99ee54c3',
                    fileId: file._id,
                }), { headers })
            );
        }
        catch (e) {
            error = e;
        }
      
        //console.dir(error.response.data, { depth: null });
        
        expect(error?.response?.data).to.exist;
        var {
            statusCode, apiStatus,
            data: { message }
        } = error.response.data;

        expect({ statusCode, apiStatus, message }).to.eql({
            statusCode: 409,
            apiStatus: 'MissingCSVColumnKeys',
            message: (
                'missing csv column keys: "biologicalGender,dateOfBirth"'
            )
        })
    })
    
    it('missing required value', async function () {
        var file = await this.createFakeFileUpload({ db, buffer: loadCSV(
            'subject-import/fs-malaysia-missing-required-value'
        )});

        var error = undefined;
        try {
            await (
                agent.post('/csv-import/subject/preview', jsonify({
                    subjectType: 'fs_malaysia_subject',
                    researchGroupId: '66051bb1c1e37e5a99ee54c3',
                    fileId: file._id,
                }), { headers })
            );
        }
        catch (e) {
            error = e;
        }
      
        //console.dir(error.response.data, { depth: null });
        
        expect(error?.response?.data).to.exist;
        var {
            statusCode, apiStatus,
            data: { message }
        } = error.response.data;

        expect({ statusCode, apiStatus, message }).to.eql({
            statusCode: 409,
            apiStatus: 'MissingCSVColumnValues',
            message: (
                'missing csv column values for: "name" in line 2'
            )
        })
    })
})
