'use strict';
var inline = require('@cdxoo/inline-text');

var MessageHandler = (spec) => {
    checkHandlerSpec(spec);
    
    var handler = { ...spec };
    return handler;
}

var checkHandlerSpec = (spec) => {
    if (!spec || typeof spec !== 'object') {
        throw new Error(inline`
            handler spec must be an object
        `);
    }

    [
        'shouldRun',
        'checkSchema',
        'checkAllowedAndPlausible',
        'triggerSystemEvents',
        'triggerOtherSideEffects',
    ].forEach(prop => {
        if (!spec[prop] && typeof spec[prop] !== 'function') {
            throw new Error(inline`
                property "${prop}" must be a function
            `);
        }
    })
};

module.exports = MessageHandler;
