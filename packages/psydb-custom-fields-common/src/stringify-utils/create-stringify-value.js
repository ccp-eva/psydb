'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');

var createStringifyValue = (options) => {
    var { fn, fallback = '-' } = options;
    var wrapped = (bag) => {
        var {
            definition, value, related,
            i18n = {}, record = undefined,
        } = bag;

        if (record) {
            var { pointer } = definition;
            value = jsonpointer.get(record, pointer);
        }

        if (!value) {
            return fallback;
        }

        return fn({ definition, value, related, i18n });
    }
    return wrapped;
}

module.exports = createStringifyValue;
