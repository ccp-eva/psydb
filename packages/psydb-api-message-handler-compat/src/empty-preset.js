'use strict';

var noop = async () => {};
var emptyPreset = () => ({
    validateMessage: noop,
    verifyAllowedAndPlausible: noop,
    executeSystemEvents: noop,
    executeRemoteEffects: noop,
});

module.exports = emptyPreset;
