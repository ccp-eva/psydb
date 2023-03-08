'use strict';
var { expect } = require('chai');
var { ejson, ObjectId } = require('@cdxoo/mongo-test-helpers');
var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);
var noop = async () => {};
var picard = ObjectId("6312720d8dde11df80a50aa2");

describe('endpoints/csv-import/preview', function () {
    var db, agent;
    beforeEach(async function () {
        await this.restore(
            '2023-03-08__0217'
        );
        
        this.createKoaApi();
        await this.signIn();

        agent = this.getApiAgent();
        db = this.getDbHandle();
    })

    it('does the thing', async function () {
        var preview = await (
            agent.post('/csv-import/preview').send({
                fileId: '6407e1e30e6da87147750f31',
                studyId: '631272148dde11df80a50c05',
                timezone: 'Europe/Berlin'
            })
        );

        console.dir(ejson(preview.body), { depth: null });
    })
})
