'use strict';
var { expect } = require('chai');
var { ejson } = require('@mpieva/psydb-core-utils');

var AnyRohrpostMeta = (options = {}) => (bag) => {
    var { eventIds } = options;
    var { baseline, current, pointer } = bag;
    try {
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

var AnyDate = (options = {}) => (bag) => {
    var { baseline, current, pointer } = bag;
    try {
        expect(String(current)).to.not.eql(String(baseline));
        expect(current).to.be.an('object');
        expect(ejson(current)).to.have.property('$date');
    }
    catch (error) {
        // FIXME: this should trigger handleDeltaError
        error.message += ` at pointer ${pointer}`;
        throw error;
    }
}

var AnyObjectId = (options = {}) => (bag) => {
    var { baseline, current, pointer } = bag;
    try {
        expect(String(current)).to.not.eql(String(baseline));
        expect(current).to.be.an('object');
        expect(ejson(current)).to.have.property('$oid');
    }
    catch (error) {
        // FIXME: this should trigger handleDeltaError
        error.message += ` at pointer ${pointer}`;
        throw error;
    }
}

module.exports = {
    AnyRohrpostMeta,
    AnyDate,
    AnyObjectId,
}
