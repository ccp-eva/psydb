'use strict';
var { expect } = require('chai');
var { ejson } = require('@cdxoo/mongo-test-helpers');

describe('base-test', function () {
    var db;
    beforeEach(async function () {
        await this.restore(
            'init-minimal-with-api-key'
        );
        
        db = this.getDbHandle();
    });

    var apiKey = [
        'xA3S5M1_2uEhgelRVaZyYjg5qw_UehHV',
        'B1bGmH9X7-S8x8sslsUxIFH5_n85Tkdh'
    ].join('');

    it('does the thing', async function () {
        await this.execute(async (bag) => {
            var { driver } = bag;
            await driver.sendMessage({
                type: 'helperSet/create',
                payload: { props: { label: 'TEST' }},
            }, { apiKey })

            console.dir(ejson(
                driver.getCache().lastChannelIds
            ), { depth: null });
        });

        var mqMessage = await (
            db.collection('mqMessageHistory').findOne({
                'message.type': 'helperSet/create'
            })
        );
        console.dir(ejson(mqMessage), { depth: null });

        var rohrpostEvent = await (
            db.collection('rohrpostEvents').findOne({
                correlationId: mqMessage._id
            })
        );
        
        console.dir(ejson(rohrpostEvent), { depth: null });
    })
})
