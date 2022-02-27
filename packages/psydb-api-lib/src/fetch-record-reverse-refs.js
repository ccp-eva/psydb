'use strict';
var { unique } = require('@mpieva/psydb-core-utils');

var createSchemaForRecordType = require('./create-schema-for-record-type');
var resolvePossibleRefs = require('./resolve-possible-refs');

var fetchRecordReverseRefs = async ({
    db,
    recordId,
}) => {
    var crts = await (
        db.collection('customRecordType')
        .find({}, { projection: { events: false }})
        .toArray()
    );

    var allReferencingRecords = [];
    for (var crt of crts) {
        console.log(crt.collection);
        var schema = await createSchemaForRecordType({
            db,
            collectionName: crt.collection,
            recordType: crt.type,
            fullSchema: true,
            prefetchedCustomRecordTypes: [ crt ]
        });

        var possibleRefs = (
            resolvePossibleRefs(schema, {
                systemTypes: [ 'ForeignId' ]
            })
            .filter(it => {
                var { systemProps: { collection }} = it;
                return true;
                return collection === 'subject'
            })
        );
        
        //console.log(possibleRefs);
        var searchPaths = unique(
            possibleRefs
            .map(it => (
                convertSchemaPointerToMongoSearchPath(it.schemaPointer)
            ))
        );

        console.log(searchPaths);
        var query = {
            type: crt.type,
            $or: searchPaths.map(it => ({
                [it]: recordId
            }))
        };
        console.log(query);
        var referencingRecords = await (
            db.collection(crt.collection)
            .find(query, { projection: {
                _id: true,
                type: true
            }})
            .toArray()
        );
        allReferencingRecords.push(...referencingRecords.map(it => ({
            ...it, collection: crt.collection
        })));
    }

    console.log(allReferencingRecords);
    return allReferencingRecords;
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
