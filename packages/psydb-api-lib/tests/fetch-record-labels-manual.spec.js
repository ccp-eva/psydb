'use strict';
var locale = require('date-fns/locale/de');
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson } = require('@mpieva/psydb-core-utils');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');

var { fetchRecordLabelsManual } = require('../src');

describe('fetchRecordLabelsManual()', function () {
    var db;
    beforeEach(async function () {
        await this.connectLocal();
        db = this.getDbHandle();
    })

    it('crt', async function () {
        var i18n = { timezone: 'Europe/Berlin', language: 'de', locale };

        var labels = await fetchRecordLabelsManual(db, {
            subject: [ ObjectId("64d42dcb443aa279ca4caeea") ]
        }, { ...i18n });

        console.log(labels);
    });
    
    it.skip('no-crt', async function () {
        var i18n = { timezone: 'Europe/Berlin', language: 'de', locale };

        var labels = await fetchRecordLabelsManual(db, {
            subject: [ ObjectId("64d42dcb443aa279ca4caeea") ]
        }, { ...i18n });

        console.log(labels);
    });
});
