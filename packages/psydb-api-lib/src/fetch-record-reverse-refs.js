'use strict';
var { unique, without } = require('@mpieva/psydb-core-utils');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');
var createSchemaForRecordType = require('./create-schema-for-record-type');
var resolvePossibleRefs = require('./resolve-possible-refs');

var fetchRecordReverseRefs = async (bag) => {
    var {
        db,
        recordId,
        refTargetCollection,
        excludedCollections = [],

        // FIXME: this sould maybe be hae a seperate function?
        recordIsHelperSetItem = false
    } = bag;

    var allReferencingRecords = [];

    var staticCollections = [
        'studyTopic',
        'experiment',
        'experimentOperatorTeam'
    ];
    for (var collection of without(staticCollections, excludedCollections)) {
        var { FullSchema } = allSchemaCreators[collection];
        var schema = FullSchema({ enableInternalProps: true });
        
        var possibleRefs = (
            resolvePossibleRefs(schema, {
                systemTypes: (
                    recordIsHelperSetItem
                    ? [ 'HelperSetItemId' ]
                    : [ 'ForeignId' ]
                )
            })
            .filter(it => {
                var { systemProps: { collection }} = it;
                //return true;
                return collection === refTargetCollection
            })
        );
        
        var fetchedRefs = await fetchReferencingRecords({
            db,
            collection,
            id: recordId,
            possibleRefs
        });
        allReferencingRecords.push(...fetchedRefs);
    }

    var crts = await (
        db.collection('customRecordType')
        .find({}, { projection: { events: false }})
        .toArray()
    );

    for (var crt of crts) {
        if (excludedCollections.includes(crt.collection)) {
            continue;
        }
        //console.log(crt.collection);
        var schema = await createSchemaForRecordType({
            db,
            collectionName: crt.collection,
            recordType: crt.type,
            fullSchema: true,
            prefetchedCustomRecordTypes: [ crt ]
        });

        var possibleRefs = (
            resolvePossibleRefs(schema, {
                systemTypes: (
                    recordIsHelperSetItem
                    ? [ 'HelperSetItemId' ]
                    : [ 'ForeignId' ]
                )
            })
            .filter(it => {
                var { systemProps: { collection }} = it;
                //return true;
                return (
                    recordIsHelperSetItem
                    ? true
                    : collection === refTargetCollection
                )
            })
        );
        
        var fetchedRefs = await fetchReferencingRecords({
            db,
            collection: crt.collection,
            type: crt.type,
            id: recordId,
            possibleRefs
        });
        allReferencingRecords.push(...fetchedRefs);
    }

    //console.log('all', allReferencingRecords);
    return allReferencingRecords;
}

var fetchReferencingRecords = async (options) => {
    var {
        db,
        collection,
        type,
        id: recordId,
        possibleRefs
    } = options;

    //console.log(possibleRefs);
    var searchPaths = unique(
        possibleRefs
        .map(it => (
            convertSchemaPointerToMongoSearchPath(it.schemaPointer)
        ))
    );

    if (collection === 'subject') {
        searchPaths = searchPaths.filter(it => (
            !it.startsWith('scientific.state.internals.participatedInStudies')
        ));
    }

    //console.log(searchPaths);
    if (searchPaths.length > 0) {
        var query = {
            ...(type && { type }),
            $and: [
                { 'state.internals.isRemoved': { $ne: true }},
                { 'scientific.state.internals.isRemoved': { $ne: true }},
            ],
            $or: searchPaths.map(it => ({
                [it]: recordId
            }))
        };
        //console.log(collection, query);
        var referencingRecords = await (
            db.collection(collection)
            .find(query, { projection: {
                _id: true,
                type: true
            }})
            .toArray()
        );
        //console.log(referencingRecords);
        
        return referencingRecords.map(it => ({
            ...it, collection,
        }));
    }
    else {
        return [];
    }
}

var convertSchemaPointerToMongoSearchPath = (schemaPointer) => {
    var inObject = false;
    var inOneOf = false;

    var searchPath = (
        schemaPointer
        .split(/\//)
        .filter((it, ix, ary) => {
            //console.log(it, ix, ary);
            if (!it) {
                return false;
            }
            if (it === 'properties' && !inObject) {
                inObject = true;
                return false;
            }

            if (it === 'items' && !inObject) {
                return false;
            }

            if (it === 'oneOf' && !inObject) {
                inOneOf = true;
                return false;
            }

            if (inOneOf) {
                inOneOf = false;
                return false;
            }

            inObject = false;
            return true;
        })
        .join('.')
    );

    //console.log(searchPath);
    return searchPath;
}

module.exports = fetchRecordReverseRefs;
