'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var Ajv = require('../../ajv');

var validateMany = (bag) => {
    var { schema, items, ajvOptions = {}} = bag;
    var ajv = Ajv(ajvOptions);

    var validation = [];
    for (var it of items) {
        //console.dir(ejson(it), { depth: null });
        var isValid = ajv.validate(schema, it);
        validation.push(
            isValid
            ? ({ isValid })
            : ({ isValid, validationErrors: ajv.errors })
        );
    }

    //console.dir(validation, { depth: null });
    return validation;
}

module.exports = validateMany;
