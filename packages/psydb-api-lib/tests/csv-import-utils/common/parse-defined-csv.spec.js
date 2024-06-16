'use strict';
var { stripIndents } = require('common-tags');
var qs = require('qs');

var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson } = require('@mpieva/psydb-core-utils');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var {
    ClosedObject,
    DefaultArray,
    Integer,
    SaneString,
    DateTime,
    DateOnlyServerSide,
    Id,
} = require('@mpieva/psydb-schema-fields');


var { fetchCRTSettings } = require('../../../src');
var {
    dumbParseCSV,
    parseDefinedCSV,
    parseSchemaCSV,
} = require('../../../src/csv-import-utils/common');

describe('csv-import-utils/common/parseDefinedCSV()', function () {
    //var db;
    //beforeEach(async function () {
    //    await this.restore('2023-11-29__0517-wkprc-fieldsite');
    //    db = this.getDbHandle();
    //});

    var csv4000;
    before(async function () {
        csv4000 = [ 'someAry[0],someAry[1],someNested[0].foo' ];
        for (var i = 0; i < 4000; i += 1) {
            csv4000.push('"9001","foo;bar",1');
        }
        csv4000 = csv4000.join("\n");
    })

    it('simple', async function () {
        //var data = loadCSV('evapecognition/simple');
        var parsed = parseSchemaCSV({
            csvData: stripIndents`
                someInt,someString
                9001,"foo,bar"
                9001,""
            `,
            schema: ClosedObject({
                someInt: Integer(),
                someString: SaneString({ minLength: 1 }),
            })
        })

        console.dir(ejson(parsed), { depth: null })
    });

    it('ary', function () {
        var parsed = parseSchemaCSV({
            csvData: stripIndents`
                someAry[0],someAry[1],someNested[0].foo
                "9001","foo;bar",1
            `,
            schema: ClosedObject({
                someAry: DefaultArray({
                    items: SaneString(),
                    minLength: 1
                }),
                someNested: DefaultArray({
                    items: ClosedObject({
                        foo: Integer(),
                    }),
                    minLength: 1
                })
            })
        });
        console.dir(ejson(parsed), { depth: null })
    });

    it('dates', function () {
        var parsed = parseSchemaCSV({
            csvData: stripIndents`
                someDate
                "2012-11-30T23:00:00.000Z"
            `,
            schema: ClosedObject({
                someDate: DateOnlyServerSide(),
            }),
            unmarshalClientTimezone: 'Europe/Berlin',
        });
        console.dir(ejson(parsed), { depth: null })
    });
    
    it('smart refs', function () {
        var parsed = parseSchemaCSV({
            csvData: stripIndents`
                someRef
                "1"
                "fofof"
                "000000000000000000000000"
            `,
            schema: ClosedObject({
                someRef: Id(),
            }),
            unmarshalClientTimezone: 'Europe/Berlin',
        });
        console.dir(ejson(parsed), { depth: null })
    });

    it.skip('perf 4000', function () {
        var parsed = parseSchemaCSV({
            csvData: csv4000,
            schema: ClosedObject({
                someAry: DefaultArray({
                    items: SaneString(),
                    minLength: 1
                }),
                someNested: DefaultArray({
                    items: ClosedObject({
                        foo: Integer(),
                    }),
                    minLength: 1
                })
            })
        });
    })
});
