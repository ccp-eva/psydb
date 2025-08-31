'use strict';
var { expect } = require('chai');
var Driver = require('@mpieva/psydb-driver-nodejs');

describe('basics', function () {
    var db, server, apiKey;
    before(async function () {
        await this.createServer();
        await this.restore('init-minimal-with-api-key');
        ({ db, server, apiKey } = this.getCommonVars());
    })

    it('can send message', async function () {
        var driver = Driver({ target: server, apiKey });

        await driver.sendMessage({
            type: 'helperSet/create',
            payload: { props: {
                label: 'TEST',
                displayNameI18N: { 'de': 'TEST_DE' }
            }},
        });
        
        var records = await this.fetchAllRecords('helperSet');
        expect(records[0].sequenceNumber).to.eql('1');
    });

    it('can do post request', async function () {
        var driver = Driver({ target: server, apiKey });

        var out = await driver.post({ url: '/helperSet/list', payload: {
            constraints: { '/sequenceNumber': { $in: [ '1' ]}},
            limit: 1000, offset: 0, filters: {}, showHidden: false
        }});

        expect(out.data.records[0].sequenceNumber).to.eql('1');
    })
})
