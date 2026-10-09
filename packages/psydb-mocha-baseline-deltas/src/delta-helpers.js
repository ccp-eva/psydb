'use strict';
var { BaselineDeltas } = require('@cdxoo/chai-baseline-deltas');
var { expect } = require('chai');

var AnyRohrpostMeta = (options = {}) => (bag) => {
    var { eventIds } = options;
    var { baseline, current, pointer } = bag;
    try {
        // FIXME: this sufficient?
        expect(current).to.not.eql(baseline);
        expect(current).to.be.an('object');
        if (eventIds) {
            expect(current.eventIds).to.eql(eventIds);
        }
    }
    catch (error) {
        // FIXME: this should trigger handleDeltaError
        error.message += ` at pointer ${pointer}`;
        throw error;
    }
}

var AnyFileId = (options = {}) => (bag) => {
    var { baseline, current, pointer } = bag;
    try {
        expect(JSON.stringify(current))
            .to.not.eql(JSON.stringify(baseline));

        expect(current).to.be.a('string');
        expect(/^[a-f0-9]{24}\.[a-z]{3,4}$/.test(current)).to.eql(true);
    }
    catch (error) {
        // FIXME: this should trigger handleDeltaError
        error.message += ` at pointer ${pointer}`;
        throw error;
    }
}

var AnyObject = (options = {}) => (bag) => {
    var { eventIds } = options;
    var { baseline, current, pointer } = bag;
    try {
        expect(current).to.not.eql(baseline);
        expect(current).to.be.an('object');
    }
    catch (error) {
        // FIXME: this should trigger handleDeltaError
        error.message += ` at pointer ${pointer}`;
        throw error;
    }
}

var AnyArray = (options = {}) => (bag) => {
    var { eventIds } = options;
    var { baseline, current, pointer } = bag;
    try {
        expect(current).to.not.eql(baseline);
        expect(current).to.be.an('array');
    }
    catch (error) {
        // FIXME: this should trigger handleDeltaError
        error.message += ` at pointer ${pointer}`;
        throw error;
    }
}

module.exports = {
    AnyObjectId: BaselineDeltas.AnyMongoId, // FIXME: deprecate

    AnyObject,
    AnyArray,

    AnyRohrpostMeta,
    AnyFileId,
}
