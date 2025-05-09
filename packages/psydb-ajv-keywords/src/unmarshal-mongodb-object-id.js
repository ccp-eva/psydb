'use strict';
var ObjectId = require('mongodb').ObjectId,
    formats = require('@mpieva/psydb-ajv-formats'),
    regex = formats.mongodbObjectId.validate;

var unmarshalMongodbObjectId = {
    modifying: true,
    schema: false,
    valid: true,
    validate: (data, dataPath, parentData, parentDataProperty) => {
        //console.log(data, dataPath, parentData, parentDataProperty);
        if (regex.test(String(data))) {
            parentData[parentDataProperty] = ObjectId(String(data));
        }
        //console.log(parentData[parentDataProperty]);
    }
}

module.exports = unmarshalMongodbObjectId;
