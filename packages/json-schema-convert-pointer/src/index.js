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
        console.log(tokens);
        var dataPointers = traverseArrayPointers(tokens, data);
        console.log(dataPointers);
        return dataPointers;
    }
}

var traverseArrayPointers = (pointerSet, data) => {
    console.log('pointerset', pointerSet);
    var [ currentPointer, ...nextPointerSet ] = pointerSet;
    console.dir(currentPointer);
    if (currentPointer === undefined) {
        return [];
    }

    console.dir(['fooo', data, currentPointer]);

    // TODO: breaks on Date() objects etc
    // might check against null, string, number, undefined
    if (typeof data !== 'object') {
        return [ currentPointer ];
    }

    var currentData = jsonpointer.get(data, currentPointer);

    var dataPointers = [];
    if (Array.isArray(currentData)) {
        for (var [ index, it ] of currentData.entries()) {
            var nextPointerSet = pointerSet.slice(1);
            dataPointers = [
                ...dataPointers,
                ...traverseArrayPointers(
                    nextPointerSet,
                    currentData[index]
                ).map(it => `${currentPointer}/${index}${it}`),
            ];
        }
    }
    else {
        console.dir('pshing', currentPointer);
        dataPointers.push(currentPointer);
    }

    console.log('DP', dataPointers);
    return dataPointers;
}

module.exports = convertPointer;
