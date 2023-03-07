'use strict';
var { expect } = require('chai');
var { ejson, ObjectId } = require('@cdxoo/mongo-test-helpers');
var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);
var noop = async () => {};
var picard = ObjectId("6312720d8dde11df80a50aa2");

describe('endpoints/file/upload', function () {
    var db, agent;
    beforeEach(async function () {
        await this.restore(
            '2023-03-02__1546'
        );
        
        this.createKoaApi();
        await this.signIn();

        agent = this.getApiAgent();
        db = this.getDbHandle();
    })

    it('does the thing', async function () {
        var buffer = Buffer.from([
            'onlineId,timestamp,status',
            '1234,2022-01-01T00:00:00.000Z,participated'
        ].join("\n"))

        var response = await (
            agent.post('/file/upload').attach(
                'file', buffer, 'some-import.csv'
            )
        );

        console.dir(ejson(response.body), { depth: null });
    })
})
