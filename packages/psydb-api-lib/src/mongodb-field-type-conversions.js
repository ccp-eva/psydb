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

    PhoneList: {
        alterValue: (value) => new RegExp(escape(value), 'i'),
        createProjection: (path) => ({ $map: {
            input: '$' + path,
            as: 'phoneObject',
            in: '$$phoneObject.number',
        }})
    },

}
