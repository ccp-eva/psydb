'use strict';
var { ClosedObject, DefaultArray, ForeignId, JsonPointer }
    = require('@mpieva/psydb-schema-fields');

var Schema = async (context) => {

    var schema = ClosedObject({
        '_id': ForeignId({ collection: 'customRecordType' }),
        'values': DefaultArray({
            items: ClosedObject({
                'pointer': JsonPointer(),
            })
        })
    });
    
    return schema;
}

module.exports = Schema;
