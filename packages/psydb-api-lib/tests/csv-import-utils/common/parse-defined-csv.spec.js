'use strict';
var { stripIndents } = require('common-tags');
var qs = require('qs');

var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson } = require('@mpieva/psydb-core-utils');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var { fetchCRTSettings } = require('../../../src');
var {
    dumbParseCSV,
    parseDefinedCSV
} = require('../../../src/csv-import-utils/common');

describe('csv-import-utils/common/parseDefinedCSV()', function () {
    //var db;
    //beforeEach(async function () {
    //    await this.restore('2023-11-29__0517-wkprc-fieldsite');
    //    db = this.getDbHandle();
    //});

    it('simple', async function () {
        //var data = loadCSV('evapecognition/simple');
        var parsedLines = parseDefinedCSV({
            csvData: stripIndents`
                someInt,someString
                9001,"foo,bar"
            `,
            definitions: [
                {
                    csvColumnKey: 'someInt',
                    systemType: 'Integer', props: {},
                    pointer: '/someInt'
                },
                {
                    csvColumnKey: 'someString',
                    systemType: 'SaneString', props: {},
                    pointer: '/someString'
                },
            ],
            required: [],
            throwUnknown: true,
        });
        //console.dir(ejson(parsed), { depth: null });
        console.dir(ejson(parsedLines), { depth: null });
    });

    it('ary', function () {
        var s = qs.stringify({
            someAry: [ '"foo;bar"',2 ],
            someNested: [{ foo: 1, bar: [ 1,3 ]}]
        }, {
            encode: true,
            delimiter: ';',
            allowDots: true,
            encodeValuesOnly: true,
        });

        console.log(s);
        console.dir(qs.parse(s, {
            encode: true,
            delimiter: ';',
            allowDots: true,
            encodeValuesOnly: true,
        }), { depth: null });

        console.log('AAAAAAAAAAAAA')
        console.log(encodeURIComponent('"foo;bar"'))

        var { csvColumns, csvLines } = dumbParseCSV(
            stripIndents`
                someAry[0],someAry[1],someNested[0].foo
                "9001","foo;bar",1
            `,
        );
        for (var line of csvLines) {
            var uline = [];
            for (var [ix, value] of line.entries()) {
                var u = `${csvColumns[ix]}=${encodeURIComponent(value)}`;
                uline.push(u);
            }
            uline = uline.join(';');
            var parsed = qs.parse(uline, {
                encode: true,
                delimiter: ';',
                allowDots: true,
                encodeValuesOnly: true,
            })
            console.log({ uline });
            console.dir(parsed, { depth: null });
        }
        console.log(x);
        return;


        var parsedLines = parseDefinedCSV({
            csvData: stripIndents`
                someAry[0],someAry[1]
                "9001","foo;bar"
            `,
            definitions: [
                {
                    csvColumnKey: 'someAry',
                    systemType: 'SaneStringList', props: {},
                    pointer: '/someAry'
                },
            ],
            required: [],
            throwUnknown: true,
        });
    })
});
