'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson, ObjectId } = require('@cdxoo/mongo-test-helpers');
var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);
var noop = async () => {};
var picard = ObjectId("6312720d8dde11df80a50aa2");

describe('endpoints/study/available-subject-crts', function () {
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
            agent.post('/study/available-subject-crts', jsonify({
                studyId: '6600f821a5f8769c528681df',
            }), { headers })
        );
        
        console.dir(ejson(response.data), { depth: null });
        expect(response.data).toMatchSnapshot();
    })
})
