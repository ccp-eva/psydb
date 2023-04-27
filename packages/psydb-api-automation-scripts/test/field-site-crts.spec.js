'use strict';
var { expect } = require('chai');
var { ejson } = require('@cdxoo/mongo-test-helpers');
var script = require('../src/scripts/field-site-crts');

describe('field-site-crts', function () {
    var db;
    beforeEach(async function () {
        await this.restore(
            'init-minimal-with-api-key'
        );
        
        db = this.getDbHandle();
    });

    it('does the thing', async function () {
        await this.execute(script);

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
