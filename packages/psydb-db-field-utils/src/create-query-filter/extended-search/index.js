'use strict';
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');

var createExtendedSearchFilter = (bag) => {
    var { definition, input } = bag;
    var { pointer, type, props } = definition;

    switch (type) {
        case 'SaneString':
        case 'FullText':
        case 'URLStringList':
        case 'PhoneList': // FIXME: make this a seperate thing
            return JustRegex(pointer, input);

        case 'PhoneWithTypeList':
            return JustRegex(`${pointer}/number`, input);
        
        case 'EmailList':
            return JustRegex(`${pointer}/email`, input);
        
        case 'BiologicalGender':
        case 'ExtBool':
            return InTruthyKeys(pointer, input);

        case 'DefaultBool':
            return Boolify(pointer, input, [ 'only-true', 'only-false' ]);

        case 'ForeignId':
        case 'HelperSetItemId':
            // EqualsOneOf(pointer, input, { transform: ObjectId })
            return MongoFk(pointer, input, props);

        case 'ForeignIdList':
        case 'HelperSetItemIdList':
            // IncludesOneOf(pointer, input, { any: true, map: Object });
            return MongoFkList(pointer, input);

        case 'Integer':
            return PointWithinOurInterval(pointer, input);

        case 'Address':
            return MultiRegex(pointer, input, [
                'country', 'city', 'postcode',
                'street', 'housenumber', 'affix',
            ]);

        case 'DateOnlyServerSide':
            // FIXME
            return DateOnlyServerSide(pointer, input, props);
        
        default:
            throw new Error(`unknown type "${type}" for "${pointer}"`);
    }
}

var DateOnlyServerSide = (pointer, input, props) => {
    //console.log({ field, input });
    var value = undefined;
    var { isSpecialAgeFrameField } = props;
    if (input) {
        var { interval, ageFrame } = input;
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
    return value ? { [pointer]: value } : undefined;
}

var PointWithinOurInterval = (pointer, input) => {
    var value = undefined;
    if (input && (input.min || input.max)) {
        value = {
            ...(input.min && { $gte: input.min }),
            ...(input.max && { $lte: input.max })
        };
    }
    return value ? { [pointer]: value } : undefined;
}

var MultiRegex = (pointer, input, keys) => {
    input = input || {};
    var out = {};
    for (var it of keys) {
        out = { ...out, ...JustRegex(`${pointer}/${it}`, input[key]) };
    }
    return Object.keys(out) > 0 ? out : undefined;
}


var JustRegex = (pointer, input) => (
    input
    ? { [pointer]: makeRX(input) }
    : undefined
);

var EqualsOneOfTruthyKeys = (pointer, input) => {
    input = input || {};
    var values = Object.keys(input).filter(key => !!input[key]);
    return (
        values.length > 0
        ? { [pointer]: { $in: values }}
        : undefined
    )
}

var Boolify = (pointer, input, options) => {
    var value = undefined;
    if (input === options[0]) {
        value = true;
    }
    if (input === options[1]) {
        value = false;
    }
    return (
        value !== undefined
        ? { [pointer]: value }
        : undefined
    )
}

module.exports = createExtendedSearchFilter;
