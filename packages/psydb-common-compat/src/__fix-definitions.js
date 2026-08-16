'use strict';
var __fixDefinitions = (that) => {
    //console.info('FIXING DEFINITIONS');
    if (Array.isArray(that)) {
        return that.map(__fixOneDefinition)
    }
    else {
        return __fixOneDefinition(that);
    }
}

var __fixOneDefinition = (def) => {
    var {
        type, systemType,
        dataPointer, pointer,
        ...pass
    } = def;

    type = type || systemType; // OLD
    systemType = systemType || type; // NEW

    dataPointer = dataPointer || pointer; // OLD
    pointer = pointer || dataPointer; // NEW

    return {
        systemType, type,
        pointer, dataPointer,
        ...pass
    };
}

module.exports = __fixDefinitions;
