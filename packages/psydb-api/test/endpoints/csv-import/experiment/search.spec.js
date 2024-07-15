'use strict';
var { expect } = require('chai');
var { ejson, ObjectId } = require('@cdxoo/mongo-test-helpers');
var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);
var noop = async () => {};
var picard = ObjectId("6312720d8dde11df80a50aa2");

describe('endpoints/csv-import/experiment/search', function () {
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
            agent.post('/csv-import/experiment/search', jsonify({
            }), { headers })
        );
        
        console.dir(ejson(response.data), { depth: null });
    })
})
