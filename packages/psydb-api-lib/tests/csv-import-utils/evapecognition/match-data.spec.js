'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson } = require('@mpieva/psydb-core-utils');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var { fetchCRTSettings } = require('../../../src');
var {
    parseLines,
    matchData,
    makeObjects,
} = require('../../../src/csv-import-utils/evapecognition');

describe('csv-import-utils/evapecognition/makeObjects', function () {
    var db;
    beforeEach(async function () {
        await this.restore('2023-11-29__0517-wkprc-fieldsite');
        db = this.getDbHandle();
    });

    it('simple', async function () {
        var data = loadCSV('evapecognition/simple');
        var parsedLines = parseLines({ data });
        var matchedData = await matchData({ db, parsedLines });
        //console.dir(ejson(parsed), { depth: null });
        //console.log(matchedData);

        var objects = makeObjects({
            matchedData, skipEmptyValues: true
        });

        console.dir(ejson(objects), { depth: null });
    });

});
