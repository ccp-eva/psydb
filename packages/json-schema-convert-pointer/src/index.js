'use strict';
var inline = require('@cdxoo/inline-text'),
    jsonpointer = require('jsonpointer'),
    convertLazy = require('./convert-lazy');

var arrayItemsRegex = RegExp('(?<!properties)/items');
var canConvertLazy = (pointer) => {
    return !arrayItemsRegex.test(pointer);
}

var convertPointer = (pointer, data) => {
    if (canConvertLazy(pointer)) {
        return convertLazy(pointer)
    }
    else {
        if (!data) {
            throw new Error(inline`
                lazy conversion of pointer "${pointer}" is impossible,
                data argument required
            `);
        }
        var tokens = pointer.split(arrayItemsRegex);
        //console.log(tokens);
        var dataPointers = traverseArrayPointers(tokens, data);
        //console.log(dataPointers);
        return dataPointers;
    }
}

var traverseArrayPointers = (pointerSet, data) => {
    //console.log('pointerset', pointerSet);
    var [ currentPointer, ...nextPointerSet ] = pointerSet;
    //console.dir([currentPointer, data]);
    if (currentPointer === undefined) {
        currentPointer = '';
    }

    //console.dir(['fooo', data, currentPointer]);

    if (data === undefined) {
        return [];
    }
    // TODO: breaks on Date() objects etc
    // might check against null, string, number, undefined
    if (typeof data !== 'object') {
        return [ currentPointer ];
    }

    //console.log('converting lazy');
    var currentDataPointer = convertLazy(currentPointer);
    //console.log(currentPointer, ' => ', currentDataPointer)
    var currentData = jsonpointer.get(data, currentDataPointer);
    //console.log(currentData);

    if (currentData === undefined) {
        return [];
    }

    var dataPointers = [];
    if (Array.isArray(currentData)) {
        //console.log('its an array');
        for (var [ index, it ] of currentData.entries()) {
            //console.log(index);
            var nextPointerSet = pointerSet.slice(1);
            dataPointers = [
                ...dataPointers,
                ...traverseArrayPointers(
                    nextPointerSet,
                    currentData[index]
                ).map(it => `${currentDataPointer}/${index}${it}`),
            ];
        }
    }
    else {
        //console.dir('pshing', currentDataPointer);
        dataPointers.push(currentDataPointer);
    }

    //console.log('DP', dataPointers);
    return dataPointers;
}

module.exports = convertPointer;
