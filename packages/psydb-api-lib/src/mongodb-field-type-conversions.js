'use strict';
var escape = require('escape-string-regexp');

module.exports = {
    Address: {
        createProjection: (path) => {
            $concat: (
                [
                    'street',
                    'housenumber',
                    'affix',
                    'postcode',
                    'city',
                    // omitting country here,
                ].flatMap((field, index) => (
                    index === 0
                    ? `$${path}.${key}`
                    : [ ' ', `$${path}.${key}` ]
                ))
            )
        },
    },
    SaneString: {
        alterValue: (value) => new RegExp(escape(value))
    },
}
