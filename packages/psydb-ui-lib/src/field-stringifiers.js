'use strict';
import datefns from './date-fns';

export const AgeFrameEdge = (value) => {
    var tmp = value;

    var years = Math.floor(tmp / 360);
    tmp %= 360;

    var months = Math.floor(tmp / 30);
    tmp %= 30;

    var days = tmp;

    return `${years}/${months}/${days}`;
}

export const Address = (value) => (
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
export const EmailList = (value) => (
    value.map(it => it.email).join(', ')
);

// TODO: decide if we want to separate stringify stuff into
// label/display
export const PhoneList = (value) => (
    value.map(it => it.number).join(', ')
);
export const DateTime = (value) => (datefns.format(new Date(value), 'P p'));
export const AgeFrame = (value) => {
    var start = AgeFrameEdge(value.start);
    var end = AgeFrameEdge(value.end)
    return `${start} - ${end}`;
}

export const BiologicalGender = (value) => {
    return {
        'male': 'Männlich',
        'female': 'Weiblich',
        'unknown': 'Unbekannt',
    }[value];
}

export const ExtBool = (value) => {
    return {
        'yes': 'Ja',
        'no': 'Nein',
        'unknown': 'Unbekannt',
    }[value];
}

