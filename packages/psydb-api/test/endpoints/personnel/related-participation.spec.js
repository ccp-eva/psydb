'use strict';
var { expect } = require('chai');
var { ejson, ObjectId } = require('@cdxoo/mongo-test-helpers');
var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);
var noop = async () => {};
var picard = ObjectId("6312720d8dde11df80a50aa2");


var endpoints = require('../../../src/endpoints');

describe('endpoints/personnel/related-participation', function () {
    var db;
    beforeEach(async function () {
        await this.restore(
            '2023-03-02__1546'
        );
        db = this.getDbHandle();
    })

    it('proper response', async function () {
        var context = {
            db,
            request: { body: jsonify({
                personnelId: picard,
                timezone: 'Europe/Berlin'
            })},
            response: {}
        };
        await endpoints.personnel.relatedParticipation(context, noop);

        console.dir(ejson(context.body), { depth: null });
    })
})
