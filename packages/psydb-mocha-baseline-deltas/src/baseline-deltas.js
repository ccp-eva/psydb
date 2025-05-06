'use strict';
var { expect } = require('chai');
var { ejson, pathify } = require('@mpieva/psydb-core-utils');
var BaselineDeltas = require('@cdxoo/assert-baseline-deltas');

var defaultOptions = {
    checkRest: ({ expectedRest, actualRest }) => {
        expect(actualRest).to.eql(expectedRest);
    },
    checkDelta: ({ baseline, current, expected, pointer }) => {
        expect(current).to.not.eql(baseline);
        expect(current).to.eql(expected);
    },
    handleDeltaError: ({ error, pointer }) => {
        error.message += ` at pointer ${pointer}`;
        throw error;
        //throw new Error(error.message + ` at pointer ${pointer}`);
    },
}
var BaselineDeltas_Extended = (options) => {
    options = { ...defaultOptions, ...options };
    
    var that = BaselineDeltas(options);
    var base = { ...that };

    that.setBaseline = (...args) => {
        var [ obj, ...pass ] = args;
        obj = obj === undefined ? obj : ejson(obj);
        base.setBaseline(obj, ...pass);
    };
    
    that.setCurrent = (...args) => {
        var [ obj, ...pass ] = args;
        obj = obj === undefined ? obj : ejson(obj);
        base.setCurrent(obj, ...pass);
    };

    that.test = (bag) => {
        var { expected, asFlatEJSON = false, ...pass } = bag;
        if (asFlatEJSON) {
            expected = pathify(expected, {
                delimiter: '/', prefix: '', traverseArrays: true
            });
            // NOTE: we need to keep functions AnyDate etc helpers 
            for (var [key, value] of Object.entries(expected)) {
                expected[key] = typeof value === 'function' ? value : (
                    ejson(value)
                );
            }
        }
        return base.test({ expected, ...pass });
    }

    return that;
}

module.exports = BaselineDeltas_Extended;
