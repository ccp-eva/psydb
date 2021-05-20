'use strict';
var inline = require('@cdxoo/inline-text'),
    jsonpointer = require('jsonpointer'),
    convertLazy = require('./convert-lazy');

var arrayItemsRegex = RegExp('(?<!properties)/items');
var canConvertLazy = (pointer) => {
    return !arrayItemsRegex.test(pointer);
}

var convertPointer = (pointer, data, options = {}) => {
    if (options.forceLazy || canConvertLazy(pointer)) {
        return convertLazy(pointer)
    }
    else {
        if (!data) {
            throw new Error(inline`
                lazy conversion of pointer "${pointer}" is impossible,
                data argument required
            `);
        }
        //console.log('pointer', pointer);
        var tokens = pointer.split(/(?<!properties)\/items/);
        if (tokens.length > 0 && tokens[tokens.length - 1] === '') {
            // when it splits we get an empty string in the end for strings
            // that end on /items that needs to be removed
            tokens.pop();
        }
        var dataPointers = traverseArrayPointers(tokens, data);
        //console.log(dataPointers);
        return dataPointers;
    }
}

var traverseArrayPointers = (pointerSet, data, __debugPath = '') => {
    //console.log('start traverseArrayPointers()');
    //console.log('pointerset', pointerSet);
    var [ currentPointer, ...nextPointerSet ] = pointerSet;
    
    //currentPointer = currentPointer + '/items';

    //console.dir([ 'currentPointer', currentPointer ]);
    //console.dir([ 'data', currentPointer ]);
    if (currentPointer === undefined) {
        currentPointer = [];
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
            //console.log('__debugPath', __debugPath, index);
            var nextPointerSet = pointerSet.slice(1);
            //console.log(nextPointerSet);
            if (nextPointerSet.length > 0) {
                //console.log('nextPointerSet', nextPointerSet);
                dataPointers = [
                    ...dataPointers,
                    ...traverseArrayPointers(
                        nextPointerSet,
                        currentData[index],
                        `${__debugPath}${currentDataPointer}/${index}`
                    ).map(it => `${currentDataPointer}/${index}${it}`),
                ];
            }
            else {
                //console.log(' => ', index, `${currentDataPointer}/${index}`, currentData);
                dataPointers.push(`${currentDataPointer}/${index}`)
            }
            //console.log('done',__debugPath, index);
        }
    }
    else {
        //console.dir('pshing', currentDataPointer);
        dataPointers.push(currentDataPointer);
    }

    //console.log('DP', dataPointers);
    //console.log('end traverseArrayPointers()');
    return dataPointers;
}

module.exports = convertPointer;
