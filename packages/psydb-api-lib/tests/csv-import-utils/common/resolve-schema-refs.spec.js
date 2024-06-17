'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');

var {
    ejson, entries, jsonpointer
} = require('@mpieva/psydb-core-utils');

var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var { fetchCRTSettings } = require('../../../src');
var {
    parseSchemaCSV,
    gatherSchemaRefs,
    resolveRefs,
} = require('../../../src/csv-import-utils/common');

var {
    OpenObject,
    ClosedObject,
    DefaultArray,
    Integer,
    SaneString,
    MongoFk,
    ForeignIdList,
} = require('@mpieva/psydb-schema-fields');

describe('csv-import-utils/common/gatherSchemaRefs', function () {
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
                    minItems: 1
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
            ]
        });

        var parsed = parseSchemaCSV({
            csvData: data,
            schema,
            unmarshalClientTimezone: 'Europe/Berlin',
            customColumnRemap,
        });

        var preparedObjects = parsed.map(it => it.obj);

        //console.dir(ejson(parsed), { depth: null });
        var { tokenMapping } = await gatherSchemaRefs({
            fromItems: preparedObjects,
            schema,
        });

        var { resolvedRecords, resolvedHSIs } = await resolveRefs({
            db, tokenMapping,
            extraRecordResolvePointers: { subject: [
                '/scientific/state/custom/wkprcIdCode'
            ]},
        });
        
        console.dir(ejson(resolvedRecords), { depth: null });
        console.log(tokenMapping);
        
        for (var [ix, recordTokenMapping] of tokenMapping.entries()) {
            for (var m of recordTokenMapping) {
                var { dataPointer, collection, value } = m;
                var records = resolvedRecords[collection].filter(
                    it => it.value === value
                );
                if (records.length !== 1) {
                    throw new Error('multiple or non mappable records');
                }

                jsonpointer.set(
                    preparedObjects[ix],
                    dataPointer,
                    records[0]._id
                );
            }
        }

        console.dir(ejson(preparedObjects), { depth: null });
    });

});
