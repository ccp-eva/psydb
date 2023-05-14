'use strict';
var { expect } = require('chai');
var { ejson } = require('@cdxoo/mongo-test-helpers');
var structure = require('../src/scripts/init-childlab-structure');
var script = require('../src/scripts/init-childlab-dummy-data');

describe('init-childlab-dummy-data', function () {
    var db;
    beforeEach(async function () {
        await this.restore(
            'init-minimal-with-api-key'
        );
        
        db = this.getDbHandle();
    });

    it('does the thing', async function () {
        var apiKey = [
            'xA3S5M1_2uEhgelRVaZyYjg5qw_UehHV',
            'B1bGmH9X7-S8x8sslsUxIFH5_n85Tkdh'
        ].join('');

        await this.execute({ script: structure, apiKey });
        await this.execute({ script, apiKey });

        //var mqMessage = await (
        //    db.collection('mqMessageHistory').findOne({
        //        'message.type': 'helperSet/create'
        //    })
        //);
        //console.dir(ejson(mqMessage), { depth: null });

        //var rohrpostEvent = await (
        //    db.collection('rohrpostEvents').findOne({
        //        correlationId: mqMessage._id
        //    })
        //);
        //
        //console.dir(ejson(rohrpostEvent), { depth: null });
    })
})
