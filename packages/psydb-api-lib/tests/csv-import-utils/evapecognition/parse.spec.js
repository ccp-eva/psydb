'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson } = require('@mpieva/psydb-core-utils');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var { fetchCRTSettings } = require('../../../src');
var { parseLines } = require('../../../src/csv-import-utils/evapecognition');

describe('csv-import-utils/evapecognition/parseLines()', function () {
    var db;
    beforeEach(async function () {
        await this.restore('2023-11-29__0517-wkprc-fieldsite');
        db = this.getDbHandle();
    });

    it('simple', async function () {
        var data = loadCSV('evapecognition/simple');
        var parsedLines = parseLines({ data });
        //console.dir(ejson(parsed), { depth: null });
        console.log(parsedLines[0]);
    });

});
