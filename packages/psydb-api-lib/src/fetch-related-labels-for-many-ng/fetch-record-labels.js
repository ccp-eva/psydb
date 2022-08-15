'use strict';
var debug = require('debug')('psydb:api-lib:fetchRelatedLabelsForMany:fetchRecordLabels');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');
var { keyBy } = require('@mpieva/psydb-core-utils');

var createRecordLabel = require('../create-record-label');

var fetchRecordLabels = async (bag) => {
    var { db, collection, ids, keyed = false } = bag;
   
    // FIXME: e.g. subjectGroup currently
    if (!allSchemaCreators[collection]) {
        console.warn(`no creator metadata for collection "${collection}"`);
        return undefined;
    }

    var {
        hasCustomTypes,
        //hasFixedTypes, // FIXME
        recordLabelDefinition,
    } = allSchemaCreators[collection];

    var _createLabel = undefined;
    if (hasCustomTypes) {
        var crts = await (
            db.collection('customRecordType')
            .find(
                { collection },
                { projection: {
                    'type': true,
                    'state.recordLabelDefinition': true
                }}
            )
            .toArray()
        );
        
        var crtsByType = keyBy({ items: crts, byProp: 'type' });

        _createLabel = (record) => createRecordLabel({
            definition: crtsByType[record.type].state.recordLabelDefinition,
            record
        });
    }
    else {
        _createLabel = (record) => createRecordLabel({
            definition: recordLabelDefinition,
            record
        });
    }

    var records = (
        // FIXME: slow maybe => project maybe
        await db.collection(collection).aggregate([
            { $match: {
                _id: { $in: ids }
            }},
            { $project: {
                _id: true,
                type: true,
                sequenceNumber: true,
                'gdpr.state.custom': true,
                'scientific.state.custom': true,
                'scientific.state.comment': true,
                'state.custom': true,
                'state.comment': true,
            }}
        ]).toArray()
    );

    var labeled = records.map(it => ({
        _id: it._id,
        _recordLabel: _createLabel(it)
    }));

    if (keyed) {
        return keyBy({
            items: labeled,
            byProp: '_id'
        });
    }
    else {
        return labeled;
    }
}

module.exports = fetchRecordLabels;
