'use strict';
var { expect } = require('chai');
var { ejson, ObjectId } = require('@cdxoo/mongo-test-helpers');
var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);
var noop = async () => {};
var picard = ObjectId("6312720d8dde11df80a50aa2");

describe('endpoints/csv-import/experiment/preview', function () {
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

    it('does the thing', async function () {
        var headers = {
            language: 'de',
            locale: 'de',
            timezone: 'Europe/Berlin'
        }
        var response = await (
            agent.post('/csv-import/experiment/preview', jsonify({
                studyId: '6566b5c26c830cb226c1389b',
                subjectType: 'wkprc_chimpanzee',
                locationId: '64d42de0443aa279ca4cb2e8',
                labOperatorIds: [
                    '64d42ddf443aa279ca4cb2c9',
                    '64d42ddf443aa279ca4cb2c5',
                ],
                fileId: '66152c723bc29dc9ae566c78',
            }), { headers })
        );
        
        console.dir(ejson(response.data), { depth: null });
    })
})
