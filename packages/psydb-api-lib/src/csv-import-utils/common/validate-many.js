'use strict';
var Ajv = require('../../ajv');

var validateMany = (bag) => {
    var { schema, items, ajvOptions = {}} = bag;
    var ajv = Ajv(ajvOptions);

    var validation = [];
    for (var it of items) {
        var isValid = ajv.validate(schema, it);
        validation.push(
            isValid
            ? ({ isValid })
            : ({ isValid, validationErrors: ajv.errors })
        );
    }

    return validation;
}

module.exports = validateMany;
