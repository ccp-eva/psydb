'use strict';
var { normalize: normalizeDate }
    = require('@mpieva/psydb-ajv-formats/src/date-ymd-or-dmy');

// NOTE: prepares parsed csv values before validation; walks schema and
// data side by side so that only fields of the matching systemType are
// touched (i.e. plain text fields containing something date-like are
// left alone); modifies in place
var normalizeCSVValues = (bag) => {
    var { schema, items } = bag;
    for (var it of items) {
        walk(schema, it);
    }
}

var handlers = {
    // 'dd.mm.yyyy' => 'yyyy-mm-dd'
    'DateOnlyServerSide': (data) => {
        if (typeof data === 'string' && data.includes('.')) {
            return normalizeDate(data) || data;
        }
        return data;
    },
    // isPrimary column is optional; when no item sets it the first
    // email is primary; otherwise missing ones are false
    'EmailList': (data) => {
        if (Array.isArray(data)) {
            var items = data.filter(it => it && typeof it === 'object');
            var anyGiven = items.some(it => it.isPrimary !== undefined);
            for (var [ ix, it ] of items.entries()) {
                if (it.isPrimary === undefined) {
                    it.isPrimary = (!anyGiven && ix === 0);
                }
            }
        }
        return data;
    },
    // phone type column is optional
    'PhoneWithTypeListItem': (data) => {
        if (typeof data === 'object' && data.type === undefined) {
            data.type = 'private';
        }
        return data;
    },
}

var walk = (schema, data) => {
    if (!schema || data === null || data === undefined) {
        return data;
    }

    var handler = handlers[schema.systemType];
    if (handler) {
        data = handler(data);
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

module.exports = normalizeCSVValues;
