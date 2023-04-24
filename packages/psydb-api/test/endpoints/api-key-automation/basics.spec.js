'use strict';
var { expect } = require('chai');
var { ejson, ObjectId } = require('@cdxoo/mongo-test-helpers');
//var jsonify = (that) => (
//    JSON.parse(JSON.stringify(that))
//);
//var noop = async () => {};
//var picard = ObjectId("6312720d8dde11df80a50aa2");

describe('endpoints/event : api-key automation', function () {
    var db, agent;
    beforeEach(async function () {
        await this.restore(
            '2023-04-24__2315'
        );
        
        this.createKoaApi();

        agent = this.getApiAgent();
        db = this.getDbHandle();
    })

    var apiKey = [
        'xA3S5M1_2uEhgelRVaZyYjg5qw_UehHV',
        'B1bGmH9X7-S8x8sslsUxIFH5_n85Tkdh'
    ].join('');

    it('does the thing', async function () {
        await agent.post(`/?apiKey=${apiKey}`).send({
            type: 'helperSet/create',
            timezone: 'Europe/Berlin',
            payload: { props: {
                label: 'Automated Test'
            }}
        })

        //var records = await (
        //    db.collection('helperSet').find().toArray()
        //);

        //console.dir(ejson(records), { depth: null });
    })
})
