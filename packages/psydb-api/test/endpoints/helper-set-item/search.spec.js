'use strict';
var { expect } = require('chai');
var { ejson, ObjectId } = require('@cdxoo/mongo-test-helpers');
var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);
var noop = async () => {};
var picard = ObjectId("6312720d8dde11df80a50aa2");

describe('endpoints/helper-set-item/search', function () {
    var db, agent;
    beforeEach(async function () {
        await this.restore(
            '2023-10-16__2324'
        );
        
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
            language: 'en'
        }
        var response = await (
            agent.post('/helperSetItem/search', jsonify({
                filters: {
                    '/state/label': 'Ac'
                    //'/state/displayNameI18N/de': 'Ak'
                },
                constraints: {
                    '/setId': '6429e5a8ed7180d81fc1644c'
                },
                limit: 100,
                offset: 0
            }), { headers })
        );
        
        console.dir(ejson(response.data), { depth: null });
    })
})
