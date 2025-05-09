'use strict';
var { convertPointerToPath } = require('@mpieva/psydb-core-utils');
var { makeRX, timeshiftAgeFrame } = require('@mpieva/psydb-common-lib');
var { switchQueryFilterType } = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
   
    var filter = switchQueryFilterType({
        'extended-search': () => ExtendedSearchFilter(definition, input),
        'quick-search': () => QuickSearchFilter(definition, input),
    })(type);

    return filter;
}

var QuickSearchFilter = (definition, input) => {
    var { pointer, props } = definition;
    var path = convertPointerToPath(pointer);

    return { $expr: { $regexMatch: {
        input: { $dateToString: {
            date: `$${path}`,
            format: '%d.%m.%Y', // XXX: locale (i18n)
            timezone: 'Europe/Berlin' // XXX: timezone (i18n)
        }},
        regex: makeRX(input)
    }}}
}

var ExtendedSearchFilter = (definition, input) => {
    var { pointer, props } = definition;
    var path = convertPointerToPath(pointer);

    //console.log({ field, input });
    var value = undefined;
    var { isSpecialAgeFrameField } = props;
    if (input) {
        var { interval, ageFrame } = input;
        if (interval && (interval.start || interval.end)) {
            value = {
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
            value = {
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
    //console.log(value);
    return value ? { [path]: value } : undefined;
}
module.exports = {
    createQueryFilter,
}
