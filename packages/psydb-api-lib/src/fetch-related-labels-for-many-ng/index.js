'use strict';
var debug = require('debug')('psydb:api-lib:fetchRelatedLabelsForMany');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    isPlainObject,
    merge,
    unique,
} = require('@mpieva/psydb-core-utils');

var resolvePossibleRefs = require('../resolve-possible-refs');
var gatherAllRefValues = require('../gather-all-ref-values');
var createSchemaForRecordType = require('../create-schema-for-record-type');

var fetchRecordLabels = require('./fetch-record-labels');
var fetchCRTLabels = require('./fetch-crt-labels');
var fetchHelperSetItemLabels = require('./fetch-helper-set-item-labels');

var fetchRelatedLabelsForMany = async (bag) => {
    debug('start fetchRelatedLabelsForMany()');
    var { db, collectionName: collection, records } = bag;

    // FIXME: thats a hack
    if (collection === 'customRecordType') {
        return {
            relatedRecords: {},
            relatedHelperSetItems: {}, 
            relatedCustomRecordTypes: {},
            
            relatedRecordLabels: {}, // FIXME
        };
    }

    var { hasCustomTypes, FullSchema } = allSchemaCreators[collection];
    var schema;
    if (!hasCustomTypes) {
        console.log(collection);
        schema = FullSchema({ enableInternalProps: true });
    }
    else {
        var typeKeys = unique(records.map(it => it.type))
        var typeSchemas = [];
        for (var t of typeKeys) {
            var typeSchema = await createSchemaForRecordType({
                db,
                collectionName: collection,
                recordType: t,
                fullSchema: true
            });
            typeSchemas.push(typeSchema);
        }
        schema = { oneOf: typeSchemas };
    }

    var possibleRefs = resolvePossibleRefs(schema, {
        systemTypes: [ 'ForeignId', 'HelperSetItemId', 'CustomRecordTypeKey' ]
    });


    var gathered = {};
    for (var record of records) {
        var result = gatherAllRefValues({
            possibleRefs,
            from: record,
        });

        gathered = merge(gathered, result);
    }

    var out = {
        relatedRecords: {},
        relatedHelperSetItems: {}, 
        relatedCustomRecordTypes: {},
    };

    if (gathered.records) {
        debug('fetching record labels');
        var collections = Object.keys(gathered.records);
        for (var c of collections) {
            var { ids } = gathered.records[c];
            //console.log({ ids });
            out.relatedRecords[c] = await fetchRecordLabels({
                db, collection: c, ids,
                keyed: true
            });
        }
    }

    if (gathered.helperSetItems) {
        debug('fetching helper set items');
        out.relatedHelperSetItems = await fetchHelperSetItemLabels({
            db, ids: gathered.helperSetItems.ids,
            keyed: true
        });
    }

    if (gathered.crts) {
        debug('fetching crt labels');
        var filter = { $or: (
            Object.keys(gathered.crts).map(collection => ({
                collection,
                type: { $in: gathered.crts[collection].types }
            }))
        )};
        //console.dir(filter, { depth: null });
        out.relatedCustomRecordTypes = await fetchCRTLabels({
            db,
            filter,
            keyed: true
        });
    }

    // FIXME: compat
    out.relatedRecordLabels = out.relatedRecords;

    debug('end fetchRelatedLabelsForMany()');
    return out;
}

module.exports = fetchRelatedLabelsForMany;
