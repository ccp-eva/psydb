'use strict';
var {
    timeshiftAgeFrame
} = require('@mpieva/psydb-common-lib');

var {
    hasSubjectParticipatedIn
} = require('@mpieva/psydb-mongo-stages').expressions;

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
            console.log(out);
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
        case 'DateTime':
        case 'DateOnlyServerSide':
            return pointer;

        case 'PhoneList':
            return `${pointer}/number`;
        case 'EmailList':
            return `${pointer}/email`;

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

var createSpecialFilterConditions = (filters) => {
    var {
        subjectId,
        didParticipateIn,
        didNotParticipateIn
    } = filters;

    var AND = [];
    if (subjectId) {
        AND.push({
            '_id': new RegExp(filter, 'i')
        });
    }
    if (didParticipateIn && didParticipateIn.length > 0) {
        AND.push({ $expr: (
            hasSubjectParticipatedIn({ studyIds: didParticipateIn })
        )});
    }
    if (didNotParticipateIn && didNotParticipateIn.length > 0) {
        AND.push({ $expr: { $not: (
            hasSubjectParticipatedIn({ studyIds: didNotParticipateIn })
        )}});
    }

    return { $and: AND }
}

module.exports = {
    createCustomQueryValues,
    createOneCustomQueryValue,
    getCustomQueryPointer,
    convertPointerKeys,

    createSpecialFilterConditions
}
