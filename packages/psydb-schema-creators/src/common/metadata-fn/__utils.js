'use strict';
var __compatDefinitions = (defs) => {
    console.warn('called __compatDefintions()');
    return defs.map(it => ({ ...it, dataPointer: it.pointer }))
};

module.exports = { __compatDefinitions }
