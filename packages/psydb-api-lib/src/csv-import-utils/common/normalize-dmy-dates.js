'use strict';
var { normalize: normalizeDate }
    = require('@mpieva/psydb-ajv-formats/src/date-ymd-or-dmy');

// NOTE: converts 'dd.mm.yyyy' to 'yyyy-mm-dd' for DateOnlyServerSide
// fields; walks schema and data side by side so that plain text fields
// containing something date-like are left alone; modifies in place
var normalizeDMYDates = (bag) => {
    var { schema, items } = bag;
    for (var it of items) {
        walk(schema, it);
    }
}

var walk = (schema, data) => {
    if (!schema || data === null || data === undefined) {
        return data;
    }

    if (schema.systemType === 'DateOnlyServerSide') {
        if (typeof data === 'string' && data.includes('.')) {
            return normalizeDate(data) || data;
        }
        return data;
    }

    if (schema.properties && typeof data === 'object') {
        for (var [ key, subschema ] of Object.entries(schema.properties)) {
            if (data[key] !== undefined) {
                data[key] = walk(subschema, data[key]);
            }
        }
    }
    else if (schema.items && Array.isArray(data)) {
        for (var [ ix, value ] of data.entries()) {
            data[ix] = walk(schema.items, value);
        }
    }

    return data;
}

module.exports = normalizeDMYDates;
