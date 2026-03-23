'use strict';
var { expect } = require('chai');
var { ejson } = require('@mpieva/psydb-core-utils');

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

var AnyDate = (options = {}) => (bag) => {
    var { baseline, current, pointer } = bag;
    try {
        expect(JSON.stringify(current))
            .to.not.eql(JSON.stringify(baseline));

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
        expect(JSON.stringify(current))
            .to.not.eql(JSON.stringify(baseline));

        expect(current).to.be.an('object');
        expect(ejson(current)).to.have.property('$oid');
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

var DeletedValue = (options = {}) => (bag) => {
    var { baseline, current, pointer } = bag;
    try {
        expect(current).to.not.eql(baseline);
        expect(current).to.not.exist;
    }
    catch (error) {
        // FIXME: this should trigger handleDeltaError
        error.message += ` at pointer ${pointer}`;
        throw error;
    }
}

var AnyString = (options = {}) => (bag) => {
    var { baseline, current, pointer } = bag;
    try {
        expect(JSON.stringify(current))
            .to.not.eql(JSON.stringify(baseline));

        expect(current).to.be.a('string');
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
    AnyString,
    AnyObjectId,
    AnyFileId,
    DeletedValue
}
