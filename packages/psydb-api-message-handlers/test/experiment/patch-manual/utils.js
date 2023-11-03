'use strict';

// FIXME: ok thats stupid: it relies on before() etc hooks
// which are not yet set in test-tools/require-chai-addons
var chai = require('chai');
chai.use(require('mocha-chai-jest-snapshot').jestSnapshotPlugin())
var { expect } = chai;

var sift = require('sift');

var { ObjectId } = require('@cdxoo/mongo-test-helpers');
var allHandlers = require('../../../src/');

var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);

module.exports = {
    ...require('@mpieva/psydb-core-utils'),
    expect,
    inline: require('@cdxoo/inline-text'),
    jsonify,
    sift,
    ObjectId,

    RootHandler: allHandlers,
}
