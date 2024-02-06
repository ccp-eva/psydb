'use strict';
var { expect } = require('chai');
var { ejson, ObjectId } = require('@cdxoo/mongo-test-helpers');
var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);
var noop = async () => {};
var picard = ObjectId("6312720d8dde11df80a50aa2");

describe('endpoints/public-sign-in', function () {
    var db, agent;
    beforeEach(async function () {
        await this.restore('init-minimal-with-api-key');
        db = this.getDbHandle();
    })

    it('simple auth', async function () {
        this.createKoaApi();
        await this.signIn();

        agent = this.getApiAgent();

        await agent.post('/', {
            type: 'helperSet/create',
            timezone: 'Europe/Berlin',
            payload: { props: {
                label: 'Automated Test',
                displayNameI18N: { de: 'Automated Test' }
            }}
        });

        await this.signOut();
    })
    
    it('two-factor auth', async function () {
        this.createKoaApi({ apiConfig: {
            twoFactorAuthentication: {
                isEnabled: true
            }
        }});
        try {
            await this.signIn();
        }
        catch (e) {
            expect(e.response.status).to.eql(801);
        }
        var [ codeRecord ] = await (
            db.collection('twoFactorAuthCodes').find().toArray()
        );

        console.log({ codeRecord });

        agent = this.getApiAgent();
        await agent.post('/two-factor-code/match', {
            twoFactorCode: codeRecord.code
        });

        await agent.post('/', {
            type: 'helperSet/create',
            timezone: 'Europe/Berlin',
            payload: { props: {
                label: 'Automated Test',
                displayNameI18N: { de: 'Automated Test' }
            }}
        });

        await this.signOut();
    })
})
