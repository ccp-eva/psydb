'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson, ObjectId } = require('@cdxoo/mongo-test-helpers');
var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);
var noop = async () => {};
var picard = ObjectId("6312720d8dde11df80a50aa2");

describe('endpoints/custom-record-type/list-available', function () {
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
            language: 'de'
        }
        var response = await (
            agent.post('/custom-record-type/list-available', jsonify({
                collections: [ 'subject', 'location' ]
            }), { headers })
        );
        
        console.dir(ejson(response.data), { depth: null });
        console.log(response.data.data.crts.map(it => it.label));
        //expect(response.data).toMatchSnapshot();
    })
})
