'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');

var { ObjectId } = require('@cdxoo/mongo-test-helpers');
var { ejson, omit, without } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-api-lib');

var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);

var RootHandler = require('../../../src/');

describe('study/remove-distclean wip', function () {
    var db, sendMessage, fileId;
    beforeEach(async function () {
        await this.restore('2025-09-22__1105');
        db = this.getDbHandle();

        ([ sendMessage ] = this.createMessenger({
            RootHandler,
            ...(await this.createFakeLogin({ email: 'root@example.com' }))
        }));
    });

    it('does the thing', async function () {
        var studyId = ObjectId("6566b5c26c830cb226c1389b");

        var koaContext = await sendMessage({
            type: 'study/remove-distclean',
            timezone: 'Europe/Berlin',
            payload: jsonify({
                studyId: studyId,
                //confirmation: 'dddd'
            })
        });
    })
})
