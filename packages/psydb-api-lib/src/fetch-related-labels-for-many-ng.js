'use strict';
var jsonpointer = require('jsonpointer');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    arrify,
    merge,
    unique,
    keyBy,
    groupBy,
    convertSchemaPointerToMongoPath,
    queryObject,
} = require('@mpieva/psydb-core-utils');

var resolvePossibleRefs = require('./resolve-possible-refs');
var createRecordLabel = require('./create-record-label');
var createSchemaForRecordType = require('./create-schema-for-record-type');

var fetchRelatedLabelsForMany = async (bag) => {
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


    // FIXME: this works only wehn we have no id collisions
    // accross collections, which might not be the case
    var gathered = {};
    for (var record of records) {
        for (var ref of possibleRefs) {
            var { schemaPointer, systemType, systemProps } = ref;
            var path = convertSchemaPointerToMongoPath(schemaPointer);

            var result = queryObject({
                from: record,
                path
            });

            //console.log({ path, result, data: record.state })

            if (result) {
                var pointer;
                if (systemType === 'ForeignId') {
                    pointer = `/records/${systemProps.collection}/ids`;
                }
                else if (systemType === 'HelperSetItemId') {
                    pointer = '/helperSetItems/ids';
                }
                else if (systemType === 'CustomRecordTypeKey') {
                    pointer = `/crts/${systemProps.collection}/types`
                }

                forcePush(
                    gathered, pointer,
                    ...arrify(result)
                );
            }
        }
    }

    var out = {
        relatedRecords: {},
        relatedHelperSetItems: {}, 
        relatedCustomRecordTypes: {},
    };


    if (gathered.records) {
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
        out.relatedHelperSetItems = await fetchHelperSetItemLabels({
            db, ids: gathered.helperSetItems.ids,
            keyed: true
        });
    }

    if (gathered.crts) {
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

    return out;
}

var fetchCRTLabels = async (bag) => {
    var { db, filter = {}, keyed = false } = bag;

    var crts = await (
        db.collection('customRecordType').find(
            filter,
            { projection: {
                'collection': true,
                'type': true,
                'state.label': true,
            }}
        ).toArray()
    );
    
    if (keyed) {
        var collectionGroups = groupBy({
            items: crts,
            byProp: 'collection',
        });

        for (var key of Object.keys(collectionGroups)) {
            collectionGroups[key] = keyBy({
                items: collectionGroups[key],
                byProp: 'type',
            })
        }

        return collectionGroups;
    }
    else {
        return crts;
    }
}

var fetchHelperSetItemLabels = async (bag) => {
    var { db, ids, keyed = false } = bag; 
    var items = await (
        db.collection('helperSetItem').aggregate([
            { $match: {
                _id: { $in: ids }
            }},
            { $project: {
                'setId': true,
                'state.label': true
            }}
        ]).toArray()
    );

    if (keyed) {
        var setGroups = groupBy({
            items,
            byProp: 'setId',
        });

        for (var setId of Object.keys(setGroups)) {
            setGroups[setId] = keyBy({
                items: setGroups[setId],
                byProp: '_id',
            })
        }

        return setGroups;
    }
    else {
        return items;
    }
}

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


// FIXME: epic name bro
var forcePush = (that, pointer, ...values) => {
    if (!jsonpointer.get(that, pointer)) {
        jsonpointer.set(that, pointer, []);
    }
    jsonpointer.get(that, pointer).push(...values);
}

module.exports = fetchRelatedLabelsForMany;
