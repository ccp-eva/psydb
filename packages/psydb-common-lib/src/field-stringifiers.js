'use strict';
var formatDate_ESM = require('date-fns/format');
var formatDate = formatDate_ESM.default || formatDate_ESM;

var deLocale_ESM = require('date-fns/locale/de');
var deLocale = deLocale_ESM.default || deLocale_ESM;

var ageFrameUtils = require('./age-frame-utils');

var AgeFrameEdge = (value) => {
    var { years, months, days } = ageFrameUtils.split(value);
    return `${years}/${months}/${days}`;
}

var Address = (value) => (
    [
        value.street,
        value.housenumber,
        value.affix,
        value.postcode,
        value.city,
        // omitting country here,
    ]
    .filter(it => !!it)
    .join(' ')
);

var EmailList = (value) => (
    value.map(it => it.email).join(', ')
);

// TODO: decide if we want to separate stringify stuff into
// label/display
var PhoneList = (value) => (
    value.map(it => it.number).join(', ')
);

var DateTime = (value) => {
    return (
        value === null
        ? 'Keine Angabe'
        : formatDate(new Date(value), 'P p', { locale: deLocale })
    )
};

// FIXME: timezone correction
var DateOnlyServerSide = (value) => {
    return (
        value === null
        ? '-'
        : formatDate(new Date(value), 'P', { locale: deLocale })
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

var BiologicalGender = (value) => {
    return {
        'male': 'Männlich',
        'female': 'Weiblich',
        'unknown': 'Unbekannt',
    }[value];
}

var ExtBool = (value) => {
    return {
        'yes': 'Ja',
        'no': 'Nein',
        'unknown': 'Unbekannt',
    }[value];
}

module.exports = {
    Address,
    
    // FIXME: obsolete
    AgeFrameEdge,
    AgeFrame,

    AgeFrameBoundary,
    AgeFrameInterval,

    EmailList,
    PhoneList,
    DateTime,
    DateOnlyServerSide,
    BiologicalGender,
    ExtBool
}
