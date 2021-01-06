'use strict';

var MessageHandler = (spec) => {
    checkHandlerSpec(spec);
    
    var { 
        shouldRun,
        validateBody,
        checkAllowedAndPlausible,
        triggerSystemEvents,
        triggerOtherEvents
    } = spec;

    /*var handler = {};
    // NOTE: only works when we dont use arrow function
    Object.setPrototypeOf(handler, MessageHandler.prototype);

    handler.match = (message) => (
        spec.match(message)
    );*/

    return async ({ db, rohrpost, permissions, message }) => {
        var didRun = false;
        if (shouldRun(message.type)) {
            await checkBodySchema({ db, message });
            await checkAllowedAndPlausble({ db, permissions, message });
            await triggerSystemEvents({ db, rohrpost, message });
            await triggerOtherEvents({ message });

            didRun = true;
        }
        return didRun;
    }

    //return handler;
}

var checkHandlerSpec = (spec) => {
    if (!spec || typeof spec !== 'object') {
        throw new Error(inline`
            handler spec is undefined or not an object
        `);
    }

    [
        'shouldRun',
        'checkBodySchema',
        'checkAllowedAndPlausible',
        'triggerSystemEvents',
        'triggerOtherSideEffects',
    ].forEach(prop => {
        if (!spec[prop] && typeof spec[prop] !== 'function') {
            throw new Error(inline`
                property "${prop}" is undefined
                or is not a function
            `);
        }
    })
};

module.exports = MessageHandler;
