'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson } = require('@mpieva/psydb-core-utils');

var init = require('../src/scripts/init-humankind-structure');
var patch = require('../src/scripts/humankind-structure-patch-01');

describe('humankind-structure-patch-01', function () {
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
        await this.execute({ script: init, apiKey });
        await this.execute({ script: patch, apiKey });

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
