'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');

var createStringifyValue = (options) => {
    var { fn, fallback = '-' } = options;
    var wrapped = (bag) => {
        var {
            definition, value, related,
            i18n = {}, record = undefined,
            ...pass
        } = bag;

        if (record) {
            var { pointer } = definition;
            value = jsonpointer.get(record, pointer);
        }

        if (value === undefined || value === null) {
            return fallback;
        }

        return fn({ ...pass, definition, value, related, i18n });
    }
    return wrapped;
}

module.exports = createStringifyValue;
