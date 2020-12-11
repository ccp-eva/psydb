'use strict';
var jsonpointer = require('jsonpointer');

var searchForFK = async (context, next) => {
    var {
        db,
        permissions,
        schemas,
        request
    } = context;

    var {
        sourceCollection,
        sourceSchemaFieldPointer,
        sourceRecordIds,
    } = request;

    var canAccessSource = (
        permissions.canReadCollection(sourceCollection)
    );
    if (!canAccessSource) {
        throw new Error('403') //TODO
    }

    var schema = schemas[sourceCollection],
        field = jsonpointer(schema, sourceSchemaFieldPointer);

    if (!field['db:collection']) {
        throw new Error('403') // TODO
    }

    var targetCollection = field['db:collection'],
        constraints = field['db:constraints'];

    var sourceRecords = await (
        db.collection(sourceCollection)
        .find({
            _id: sourceRecordIds
        })
        .toArray()
    );

    await next();
}
