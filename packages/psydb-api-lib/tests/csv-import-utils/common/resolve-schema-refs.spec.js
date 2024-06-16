'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson } = require('@mpieva/psydb-core-utils');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var { fetchCRTSettings } = require('../../../src');
var {
    parseSchemaCSV,
    resolveSchemaCSV
} = require('../../../src/csv-import-utils/common');

var {
    OpenObject,
    ClosedObject,
    DefaultArray,
    Integer,
    SaneString,
    MongoFk,
} = require('@mpieva/psydb-schema-fields');

describe('csv-import-utils/common/resolveSchemaRefs', function () {
    var db;
    beforeEach(async function () {
        await this.restore('2023-11-29__0517-wkprc-fieldsite');
        db = this.getDbHandle();
    });

    it('simple', async function () {
        var data = loadCSV('evapecognition/simple');
       
        var customColumnRemap = (col) => {
            if (col === 'experiment_name') {
                return 'experimentName';
            }
            if (col === 'room_or_enclosure') {
                return 'roomOrEnclosure';
            }
            if (/^participant/.test(col)) {
                var [ _unused, ix = 0 ] = col.split('_');
                return `subjectData[${ix}].subjectId`;
            }
            if (/^role/.test(col)) {
                var [ _unused, ix = 0 ] = col.split('_');
                return `subjectData[${ix}].role`;
            }

            return col;
        }
        
        var schema = OpenObject({
            properties: {
                'year': Integer({ minimum: 1000 }),
                'month': Integer({ minimum: 0 }),
                'day': Integer({ minimum: 0 }),
                'subjectData': DefaultArray({
                    items: OpenObject({
                        properties: {
                            'subjectId': MongoFk({ collection: 'subject' }),
                            'role': SaneString({ minLength: 1 })
                        },
                        required: [
                            'subjectId',
                            'role'
                        ],
                    }),
                    minLength: 1
                }),
                'experimentName': SaneString({ minLength: 1 }),
                'roomOrEnclosure': SaneString({ minLength: 1 }),
            },
            required: [
                'year',
                'month',
                'day',
                'subjectData',
                'experimentName',
                'roomOrEnclosure',
                'fofofof'
            ]
        });

        var parsed = parseSchemaCSV({
            csvData: data,
            schema,
            unmarshalClientTimezone: 'Europe/Berlin',
            customColumnRemap,
        });
        console.dir(ejson(parsed), { depth: null });
        //var resolved = resolveSchemaRefs({
        //    schema,
        //});
    });

});
