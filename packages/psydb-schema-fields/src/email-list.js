'use strict';
var EmailList = ({ minItems }) => ({
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'array',
    minItems: (minItems || 0),
    items: {
        type: 'string',
        format: 'email'
    },
})

module.exports = EmailList;
