'use strict';
var __fixDefinitions = (definitions) => {
    //console.info('FIXING DEFINITIONS');
    return definitions.map(def => {
        var { type, dataPointer, ...pass } = def;
        return { systemType: type, pointer: dataPointer, ...pass };
    })
}

module.exports = __fixDefinitions;
