'use strict';
var {
    ClosedObject, DefaultArray, OneOf,
    Id, CustomRecordTypeCollectionEnum, CustomRecordTypeKey
} = require('@mpieva/psydb-schema-fields');

var BodySchema = () => {
    var schema = ClosedObject({
        'items': DefaultArray({
            minItems: 1,
            items: OneOf([
                ClosedObject({ '_id': Id() }),
                ClosedObject({
                    'collection': CustomRecordTypeCollectionEnum(),
                    'recordType': CustomRecordTypeKey(),
                })
            ])
        })
    });

    return schema;
}

module.exports = BodySchema; 
