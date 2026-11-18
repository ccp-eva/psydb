'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var {
    ExactObject,
    ForeignId,
    ForeignIdList,
} = require('@mpieva/psydb-schema-fields');

var {
    gatherPossibleRefs,
    createRefMappings,
    replaceRefsByMapping,
} = require('../../../src/csv-import-utils/common/inject-ref-ids');

describe('csv-import-utils/common/inject-ref-ids', function () {
    var schema = ExactObject({ properties: {
        kigaId: ForeignId({ collection: 'location', recordType: 'kiga' }),
        parentIds: ForeignIdList({
            collection: 'subject', recordType: 'humankindAdult'
        }),
    }});

    var kigaId = ObjectId('65fa75f1570be84e25722b34');
    var parentId = ObjectId('65fa75f1570be84e25722b3a');

    describe('createRefMappings()', function () {
        it('creates mappings for ObjectId values in single ref fields', function () {
            var refData = gatherPossibleRefs({ schema });
            var [ mappings ] = createRefMappings({ refData, items: [{
                kigaId: ObjectId(String(kigaId)),
                parentIds: [ ObjectId(String(parentId)) ],
            }]});

            expect(mappings.map(it => it.csvColumn)).to.eql([
                'kigaId', 'parentIds[0]'
            ]);
        });
    });

    describe('replaceRefsByMapping()', function () {
        var run = (items) => {
            var refData = gatherPossibleRefs({ schema });
            var refMappings = createRefMappings({ refData, items });
            // NOTE: resolved values are distinct ObjectId instances
            // just like the ones coming back from the database
            var resolvedRecords = {
                location: [{
                    _id: kigaId, type: 'kiga',
                    pointer: '/_id', value: ObjectId(String(kigaId)),
                }],
                subject: [{
                    _id: parentId, type: 'humankindAdult',
                    pointer: '/_id', value: ObjectId(String(parentId)),
                }],
            };
            return replaceRefsByMapping({
                inItems: items, refMappings,
                resolvedRecords, resolvedHSIs: {}
            });
        }

        it('matches ObjectIds by value in single and list fields', function () {
            var [ out ] = run([{
                kigaId: ObjectId(String(kigaId)),
                parentIds: [ ObjectId(String(parentId)) ],
            }]);

            expect(out.isOk).to.eql(true);
            expect(String(out.obj.kigaId)).to.eql(String(kigaId));
            expect(out.obj.parentIds.map(String)).to.eql([ String(parentId) ]);
        });

        it('rejects ObjectIds that were not resolved', function () {
            var [ out ] = run([{
                kigaId: ObjectId('0123456789abcdef01234567'),
                parentIds: [ ObjectId('0123456789abcdef01234568') ],
            }]);

            expect(out.isOk).to.eql(false);
            expect(out.errors.map(it => it.mapping.csvColumn)).to.eql([
                'kigaId', 'parentIds[0]'
            ]);
        });
    });
});
