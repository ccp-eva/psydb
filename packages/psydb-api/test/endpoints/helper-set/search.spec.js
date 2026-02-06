'use strict';
var { expect } = require('chai');
var { ejson, ObjectId } = require('@cdxoo/mongo-test-helpers');
var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);
var noop = async () => {};
var picard = ObjectId("6312720d8dde11df80a50aa2");

describe('endpoints/helper-set/search', function () {
    var db, agent;
    beforeEach(async function () {
        await this.restore('2024-10-13__1818');
        
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
            agent.post('/helperSet/search', jsonify({
                filters: {
                    '/state/label': 'Ak'
                    //'/state/displayNameI18N/de': 'de2'
                },
                constraints: {
                    //'/state/displayNameI18N/de': 'de2'
                },
                limit: 100,
                offset: 0
            }), { headers })
        );
        
        console.dir(ejson(response.data), { depth: null });
    })
})
