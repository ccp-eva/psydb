'use strict';
var { expect } = require('chai');
var { ejson, ObjectId } = require('@cdxoo/mongo-test-helpers');
var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);
var noop = async () => {};
var picard = ObjectId("6312720d8dde11df80a50aa2");

describe('endpoints/research-group/search-metadata', function () {
    var db, agent;
    beforeEach(async function () {
        await this.connectLocal();
        db = this.getDbHandle();
    })

    it('no body', async function () {
        this.createKoaApi();
        await this.signIn();

        agent = this.getApiAgent();

        var out = await agent.post('/researchGroup/search-metadata', {});
        console.dir(ejson(out.data), { depth: null });

        await this.signOut();
    })
    
    it('no records, some filters', async function () {
        this.createKoaApi();
        await this.signIn();

        agent = this.getApiAgent();

        var out = await agent.post('/researchGroup/search-metadata', {
            filters: { labMethods: ['inhouse']},
            projectedFields: ['subjectTypes', 'labMethods'],
            includeRecords: false
        });
        console.dir(ejson(out.data), { depth: null });

        await this.signOut();
    })
})
