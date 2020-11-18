'use strict';
var derive = (baseRef, newId) => {
    var ref = { $ref: `${newId}#` };

    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: newId,
        allOf: [ baseRef ]
    }

    return {
        id: newId,
        ref,
        schema,
    }
};

module.exports = derive;
