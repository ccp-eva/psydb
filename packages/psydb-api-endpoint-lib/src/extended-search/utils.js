'use strict';
var { ObjectId } = require('mongodb');
var escapeRX = require('escape-string-regexp');

var { timeshiftAgeFrame } = require('@mpieva/psydb-common-lib');
var {
    convertPointerToPath,
} = require('@mpieva/psydb-api-lib');

var makeRX = (str) => (
    new RegExp(escapeRX(str), 'i')
)

var createCustomQueryValues = (options) => {
    var { fields, filters } = options;
    var values = {};

    for (var field of fields) {
        var { key } = field;
        var filter = filters[key];
        if (filter) {
            var fieldValues = (
                createOneCustomQueryValueObject({ field, filter })
            );
            values = { ...values, ...fieldValues };
        }
    }

    //console.log(values);
    return values;
}

var createOneCustomQueryValueObject = (options) => {
    var { field, filter } = options;
    var { pointer, type, props } = field;
    switch (type) {
        case 'SaneString':
            return { [pointer]: makeRX(filter) };
        case 'FullText':
            return { [pointer]: makeRX(filter) };

        case 'PhoneList': // FIXME: make this a seperate thing
            return { [pointer]: makeRX(filter) };

        case 'PhoneWithTypeList':
            pointer = `${pointer}/number`;
            return { [pointer]: makeRX(filter) };

        case 'EmailList':
            pointer = `${pointer}/email`;
            return { [pointer]: makeRX(filter) };

        case 'BiologicalGender':
        case 'ExtBool':
            filter = filter || {};
            var values = Object.keys(filter).filter(key => !!filter[key]);
            return (
                values.length > 0
                ? { [pointer]: { $in: values }}
                : undefined
            )

        case 'DefaultBool':
            var value = undefined;
            if (filter === 'only-true') {
                value = true;
            }
            if (filter === 'only-false') {
                value = false;
            }
            return (
                value !== undefined
                ? { [pointer]: value }
                : undefined
            )


        case 'ForeignId':
        case 'ForeignIdList':
        case 'HelperSetItemId':
        case 'HelperSetItemIdList':
            filter = filter || {};
            var op = filter.negate ? '$nin' : '$in';
            return (
                filter.values && filter.values.length > 0
                ? { [pointer]: { [op]: filter.values.map(ObjectId) }}
                : undefined
            )

        case 'Integer':
            var out = undefined;
            if (filter && (filter.min || filter.max)) {
                out = {
                    ...(filter.min && {
                        $gte: filter.min
                    }),
                    ...(filter.max && {
                        $lte: filter.max
                    })
                };
            }
            return { [pointer]: out };

        case 'DateOnlyServerSide':
            //console.log({ field, filter });
            var out = undefined;
            var { isSpecialAgeFrameField } = props;
            if (filter) {
                var { interval, ageFrame } = filter;
                if (interval && (interval.start || interval.end)) {
                    out = {
                        // FIXME: date conversion via ajv
                        // FIXME: endOfDay?
                        ...(interval.start && {
                            $gte: new Date(interval.start)
                        }),
                        ...(interval.end && {
                            $lt: new Date(interval.end)
                        })
                    };
                }
                if (isSpecialAgeFrameField && ageFrame) {
                    var now = new Date();
                    var timeshifted = timeshiftAgeFrame({
                        ageFrame, targetDate: now
                    });
                    out = {
                        ...(timeshifted.start && {
                            $gte: timeshifted.start
                        }),
                        ...(timeshifted.end && {
                            $lt: timeshifted.end
                        })
                    }
                    //out = { $expr: {}};
                }
            }
            //console.log(out);
            return { [pointer]: out };

        case 'Address':
            //console.log(filter);
            filter = filter || {};
            var out = {
                ...(filter.country && {
                    [pointer + '/country']: filter.country,
                }),
                ...(filter.city && {
                    [pointer + '/city']: makeRX(filter.city),
                }),
                ...(filter.postcode && {
                    [pointer + '/postcode']: makeRX(filter.postcode),
                }),
                ...(filter.street && {
                    [pointer + '/street']: makeRX(filter.street),
                }),
                ...(filter.housenumber && {
                    [pointer + '/housenumber']: makeRX(filter.housenumber),
                }),
                ...(filter.affix && {
                    [pointer + '/affix']: makeRX(filter.affix),
                }),
            }
            //console.log(out);
            return out;
            
        default:
            throw new Error(`unknown type "${type}" for "${pointer}"`);
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
    convertPointerKeys,
    makeRX,
    escapeRX, // FIXME: use make RX
}
