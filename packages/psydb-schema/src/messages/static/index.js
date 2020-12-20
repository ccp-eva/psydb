'use strict';
module.exports = () => ([
    {
        messageType: 'set-personnel-password',
        schema: require('./set-personnel-password'),
    },
    {
        messageType: 'create-helper-set',
        schema: require('./create-helper-set'),
    },
])
