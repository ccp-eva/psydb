'use strict';
var { __maybeUseESM } = require('@mpieva/psydb-common-compat');
var formatDate = __maybeUseESM(require('date-fns/format'));

var { formatInTimeZone } = require('date-fns-tz');

var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { Fields } = require('@mpieva/psydb-custom-fields-common');

var ageFrameUtils = require('./age-frame-utils');
var calculateAge = require('./calculate-age');

var AgeFrameEdge = (value) => {
    var { years, months, days } = ageFrameUtils.split(value);
    return `${years}/${months}/${days}`;
}

var wrap = (fn) => (value) => fn({ value });
var out = {};
for (var it of [
    'Address',
    'SaneStringList',
]) {
    out[it] = wrap(Fields[it].stringifyValue);
}

var URLStringList = (value) => (
    value.join(', ')
);


var EmailList = (value) => (
    value.map(it => it.email).join(', ')
);

// TODO: decide if we want to separate stringify stuff into
// label/display
var PhoneWithTypeList = (value) => (
    value.map(it => it.number).join(', ')
);

var DateTime = (value, options = {}) => {
    var { timezone, locale } = options;

    if (value === null) {
        return '-';
    }

    var other = [ 'P p', { locale } ];
    return (
        timezone
        ? formatInTimeZone(new Date(value), timezone, ...other)
        : formatDate(new Date(value), ...other)
    )
};

var DateOnlyServerSide = (value, options = {}) => {
    var { timezone, locale } = options;

    if (value === null) {
        return '-';
    }

    var other = [ 'P', { locale } ];
    return (
        timezone
        ? formatInTimeZone(new Date(value), timezone, ...other)
        : formatDate(new Date(value), ...other)
    )
};

var AgeFrame = (value) => {
    var start = AgeFrameEdge(value.start);
    var end = AgeFrameEdge(value.end)
    return `${start} - ${end}`;
}

var AgeFrameBoundary = (value) => {
    var { years, months, days } = value;
    return `${years}/${months}/${days}`;
}

var AgeFrameInterval = (value) => {
    var start = AgeFrameBoundary(value.start);
    var end = AgeFrameBoundary(value.end);
    return `${start} - ${end}`;
}

var BiologicalGender = (value, { short, language } = {}) => {
    if (language === 'de') {
        if (short) {
            return {
                'male': 'm',
                'female': 'w',
                'other': 'd',
                'unknown': 'u',
            }[value];
        }
        else {
            return {
                'male': 'Männlich',
                'female': 'Weiblich',
                'other': 'Divers',
                'unknown': 'Unbekannt',
            }[value];
        }
    }
    else {
        if (short) {
            return {
                'male': 'm',
                'female': 'f',
                'other': 'o',
                'unknown': 'u',
            }[value];
        }
        else {
            return {
                'male': 'Male',
                'female': 'Female',
                'other': 'Other',
                'unknown': 'Unknown',
            }[value];
        }
    }
}

var ExtBool = (value, { short, language } = {}) => {
    if (language === 'de') {
        if (short) {
            return {
                'yes': 'J',
                'no': 'N',
                'unknown': 'U',
            }[value];
        }
        else {
            return {
                'yes': 'Ja',
                'no': 'Nein',
                'unknown': 'Unbekannt',
            }[value];
        }
    }
    else {
        if (short) {
            return {
                'yes': 'Y',
                'no': 'N',
                'unknown': 'U',
            }[value];
        }
        else {
            return {
                'yes': 'Yes',
                'no': 'No',
                'unknown': 'Unknown',
            }[value];
        }
    }
}

var Lambda = (bag = {}) => {
    var { definition, record, timezone } = bag;
    var { fn, input } = definition.props;
    if (fn === 'deltaYMD') {
        fn = (it) => it ? calculateAge({
            base: it,
            relativeTo: new Date(),
            asString: true
        }) : '-';
    }

    return fn(jsonpointer.get(record, input))
};

var DefaultBool = (value, { language } = {}) => {
    if (language === 'de') {
        return {
            'true': 'Ja',
            'false': 'Nein',
        }[String(value)] || 'ERROR';
    }
    else {
        return {
            'true': 'Yes',
            'false': 'No',
        }[String(value)] || 'ERROR';
    }
}

module.exports = {
    ...out,
    
    // FIXME: obsolete
    AgeFrameEdge,
    AgeFrame,

    AgeFrameBoundary,
    AgeFrameInterval,

    URLStringList,
    EmailList,
    PhoneWithTypeList,
    DateTime,
    DateOnlyServerSide,
    BiologicalGender,
    ExtBool,
    DefaultBool,

    Lambda
}
