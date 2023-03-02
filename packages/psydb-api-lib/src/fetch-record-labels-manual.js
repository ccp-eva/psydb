'use strict';
var { entries } = require('@mpieva/psydb-core-utils');
var stringifiers = require('@mpieva/psydb-common-lib/src/field-stringifiers');
var fetchAllCRTSettings = require('./fetch-all-crt-settings');
var createRecordLabel = require('./create-record-label');
var mergeRecordLabelProjections = require('./merge-record-label-projections');

var fetchRecordLabelsManual = async (db, idsForCollection, options = {}) => {
    var { timezone } = options;

    var allCRTSettings = await fetchAllCRTSettings(db, [
        ...Object.keys(idsForCollection).map(
            (collection) => ({ collection })
        )
    ], { wrap: true });

    var related = {};
    for (var [ collection, ids ] of entries(idsForCollection)) {
        var recordLabelProjection = mergeRecordLabelProjections(
            allCRTSettings[collection], { as: '_labelProjection' }
        );

        var records = await (
            db.collection(collection)
            .aggregate([
                { $match: {
                    _id: { $in: ids }
                }},
                { $project: {
                    _id: true,
                    type: true,
                    ...recordLabelProjection
                }}
            ])
            .toArray()
        );

        related[collection] = records.reduce((acc, record) => ({
            ...acc,
            [record._id]: createRecordLabel({
                record,
                definition: (
                    allCRTSettings[collection][record.type]
                    .getRecordLabelDefinition()
                ),
                from: '_labelProjection',
                timezone
            })
        }), {});
    }
    return related;
}

module.exports = fetchRecordLabelsManual;
