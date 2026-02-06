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

    var baseline_raw = undefined;
    var current_raw = undefined;

    that.setBaseline = (...args) => {
        var [ obj, ...pass ] = args;
        obj = obj === undefined ? obj : ejson(obj);
        base.setBaseline(obj, ...pass);
        baseline_raw = obj;
    };
    
    that.setCurrent = (...args) => {
        var [ obj, ...pass ] = args;
        obj = obj === undefined ? obj : ejson(obj);
        base.setCurrent(obj, ...pass);
        current_raw = obj;
    };

    that.getBaseline_RAW = () => baseline_raw;
    that.getCurrent_RAW = () => current_raw;

    that.test = (bag) => {
        var {
            expected,
            asEJSON = true,
            asFlatEJSON = false,
            ...pass
        } = bag;

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

            // FIXME: thats a hack for when base keys are already pointers
            // this might lead to unexpected behavior when we actually have
            // leading slashes in keys; but i dont see that
            var __expected = {};
            for (var [key, value] of Object.entries(expected)) {
                if (key.startsWith('//')) {
                    key = key.replace(/^\//, '');
                }
                __expected[key] = value;
            }
            expected = __expected;
        }
        else if (asEJSON) {
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
