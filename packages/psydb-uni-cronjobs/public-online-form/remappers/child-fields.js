'use strict';
var { RemapPairError } = require('../errors');
var { sane, lc, justremap } = require('./helpers');

var ChildFields = {
    ...justremap([
        [ 'Nachname', 'gdpr.custom.lastname' ],
        [ 'Vorname', 'gdpr.custom.firstname' ],
    ]),

    'Geschlecht des Kindes': (value) => {
        var mapped = {
            'weiblich': 'female',
            'männlich': 'male',
            'divers': 'other',
        }[value];
        if (!mapped) {
            throw new RemapPairError();
        }
        
        return { path: 'gdpr.custom.gender', value: mapped }
    },

    'Geburtsdatum': (value) => {
        var [ y, m, d] = (
            value.split(/\./g).map((it) => parseInt(it)).reverse()
        );

        var date = new Date(0);
        date.setUTCFullYear(y);
        date.setUTCMonth(m - 1);
        date.setUTCDate(d);

        return {
            path: 'gdpr.custom.dateOfBirth',
            value: date.toISOString()
        }
    },

    'Muttersprache des Kindes': (value, extra) => {
        var { languages } = extra;
        var id = (
            value === 'Andere'
            ? '#OTHER#'
            : languages[lc(value)]
        );
        if (!id) {
            throw new RemapPairError();
        }

        return { path: 'scientific.custom.nativeLanguageId', value: id }
    },
    'andere Muttersprache': (value, extra) => {
        var { languages } = extra;
        var id = languages[lc(value)];
        if (!id) {
            throw new RemapPairError();
        }

        return { path: 'scientific.custom.nativeLanguageId', value: id }
    },
    'Zweitsprache des Kindes': (value, extra) => {
        var { languages } = extra;
        var id = (
            value === 'Andere'
            ? '#OTHER#'
            : languages[lc(value)]
        );
        if (!id) {
            throw new RemapPairError();
        }
        
        return { path: 'scientific.custom.otherLanguageIds', value: [ id ] };
    },
    'andere Zweitsprache': (value, extra) => {
        var { languages } = extra;
        var id = languages[lc(value)];
        if (!id) {
            throw new RemapPairError();
        }
        
        return { path: 'scientific.custom.otherLanguageIds', value: [ id ] };
    } 
}

module.exports = ChildFields;
