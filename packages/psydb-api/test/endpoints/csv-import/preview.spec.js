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
            '2023-03-02__1546'
        );
        
        this.createKoaApi();
        await this.signIn();

        agent = this.getApiAgent();
        db = this.getDbHandle();
    })

    it('does the thing', async function () {
        var buffer = Buffer.from([
            'onlineId,timestamp',
            'R3vr6dx7,2023-01-01T00:00:00.000Z',
            'F2PCzMQx,2023-02-02T00:00:00.000Z',
        ].join("\n"))

        var upload = await (
            agent.post('/file/upload').attach(
                'file', buffer, 'some-import.csv'
            )
        );
        var fileId = upload.body.data.records[0]._id;
        
        var preview = await (
            agent.post('/csv-import/preview').send({
                fileId,
                studyId: '631272148dde11df80a50c05',
                timezone: 'Europe/Berlin'
            })
        );

        console.dir(ejson(preview.body), { depth: null });
    })
})
