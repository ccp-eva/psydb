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
            'init-minimal-with-api-key'
        );
        
        this.createKoaApi();

        agent = this.getApiAgent();
        db = this.getDbHandle();
    });

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

        var mqMessage = await (
            db.collection('mqMessageHistory').findOne({
                'message.type': 'helperSet/create'
            })
        );
        //console.dir(ejson(mqMessage), { depth: null });
        expect(mqMessage.apiKey).equal(apiKey);

        var rohrpostEvent = await (
            db.collection('rohrpostEvents').findOne({
                correlationId: mqMessage._id
            })
        );
        
        //console.dir(ejson(rohrpostEvent), { depth: null });
        expect(rohrpostEvent.message.apiKey).equal(apiKey);
    })
})
