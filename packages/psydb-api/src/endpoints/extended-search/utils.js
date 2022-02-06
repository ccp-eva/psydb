'use strict';
var {
    convertPointerToPath,
} = require('@mpieva/psydb-api-lib');

var createCustomQueryValues = (options) => {
    var { fields, filters } = options;
    var values = {};

    for (var field of fields) {
        var { key } = field;
        var filter = filters[key];
        if (filter) {
            var pointer = getCustomQueryPointer({ field });
            var value = createOneCustomQueryValue({
                field, filter: filters[key]
            });

            values[pointer] = value;
        }
    }

    return values;
}

var createOneCustomQueryValue = (options) => {
    var { field, filter } = options;
    var { type, props } = field;
    switch (type) {
        case 'SaneString':
        case 'PhoneList':
        case 'EmailList':
            return new RegExp(filter, 'i');

        case 'BiologicalGender':
        case 'ExtBool':
            filter = filter || {};
            return { $in: Object.keys(filter).filter(key => !!filter[key]) }

        case 'ForeignId':
        case 'ForeignIdList':
        case 'HelperSetItemId':
        case 'HelperSetItemIdList':
            filter = filter || {};
            var op = filter.negate ? '$nin' : '$in';
            return { [op]: filter.values };

        case 'DateOnlyServerSide':
            console.log({ field, filter });
            var out = undefined;
            var { isSpecialAgeFrameField } = props;
            if (filter) {
                var { interval, ageFrame } = filter;
                if (interval) {
                    out = { $expr: {}};
                }
                if (isSpecialAgeFrameField && ageFrame) {
                    out = { $expr: {}};
                }
            }
            return out;

    }
}

var getCustomQueryPointer = (options) => {
    var { field } = options;
    var { type, pointer } = field;

    switch (type) {
        case 'SaneString':
        case 'ForeignId':
        case 'ForeignIdList':
        case 'HelperSetItemId':
        case 'HelperSetItemIdList':
        case 'BiologicalGender':
        case 'ExtBool':
            return pointer;

        case 'PhoneList':
            return `${pointer}/number`;
        case 'EmailList':
            return `${pointer}/email`;
    }
}

var convertPointerKeys = (obj) => {
    var converted = Object.keys(obj).reduce((acc, key) => ({
        ...acc,
        [ convertPointerToPath(key) ]: obj[key],
    }), {});

    return converted;
}

module.exports = {
    createCustomQueryValues,
    createOneCustomQueryValue,
    getCustomQueryPointer,
    convertPointerKeys
}
