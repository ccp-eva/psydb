'use strict';
var escape = require('escape-string-regexp');

module.exports = {
    Address: {
        createProjection: (path) => ({ $concat: (
            [
                'street',
                'housenumber',
                'affix',
                'postcode',
                'city',
                // omitting country here,
            ].flatMap((field, index) => (
                index === 0
                ? `$${path}.${field}`
                : [ ' ', `$${path}.${field}` ]
            ))
        ) }),
    },
    SaneString: {
        alterValue: (value) => new RegExp(escape(value), 'i')
    },

    EmailList: {
        alterValue: (value) => new RegExp(escape(value), 'i'),
        createProjection: (path) => ({ $map: {
            input: '$' + path,
            as: 'emailObject',
            in: '$$emailObject.email',
        }})
    },

    PhoneWithTypeList: {
        alterValue: (value) => new RegExp(escape(value), 'i'),
        createProjection: (path) => ({ $map: {
            input: '$' + path,
            as: 'phoneObject',
            in: '$$phoneObject.number',
        }})
    },

    DateOnlyServerSide: {
        alterValue: (value) => new RegExp(escape(value), 'i'),
        // XXX: this is hardcoded for german formattinga
        // we could try to determine the formatting based on the input
        // i.e. it contains a dot the format to german
        // if it contains dash then format to international
        // but om not sure about fr/us/uk formats
        createProjection: (path) => ({ $dateToString: {
            date: '$' + path,
            format: '%d.%m.%Y',
            // XXX: timezone for germany because of behavior
            // in 1st of Janurary when searching via stringified date
            timezone: 'Europe/Berlin'
        }})
    },

    Integer: {
        alterValue: (value) => new RegExp(escape(String(value)), 'i'),
        createProjection: (path) => ({ $convert: {
            input: '$' + path,
            to: 'string'
        }})
    },
}
