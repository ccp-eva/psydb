'use strict';
var { expect } = require('chai');
var { ejson, ObjectId } = require('@cdxoo/mongo-test-helpers');
var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);
var noop = async () => {};
var picard = ObjectId("6312720d8dde11df80a50aa2");


var endpoints = require('../../../src/endpoints');

describe('endpoints/helper-set/search', function () {
    var db;
    beforeEach(async function () {
        await this.restore(
            '2023-10-16__2324'
        );
        db = this.getDbHandle();
    })

    it('proper response', async function () {
        var context = {
            db,
            request: {
                headers: {
                    language: 'de'
                },
                body: jsonify({
                    filters: {
                        //'/state/displayNameI18N/de': 'de2'
                    },
                    constraints: {
                        '/state/displayNameI18N/de': 'de2'
                    },
                    limit: 100,
                    offset: 0
                })
            },
            response: {}
        };
        await endpoints.helperSet.search(context, noop);

        console.dir(ejson(context.body), { depth: null });
    })
})
