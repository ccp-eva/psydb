'use strict';

// FIXME: ok thats stupid: it relies on before() etc hooks
// which are not yet set in test-tools/require-chai-addons
var chai = require('chai');
chai.use(require('mocha-chai-jest-snapshot').jestSnapshotPlugin())
var { expect } = chai;

var { ObjectId } = require('@cdxoo/mongo-test-helpers');
var { ejson, omit } = require('@mpieva/psydb-core-utils');
var allHandlers = require('../../../src/');

var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);

module.exports = {
    expect,
    inline: require('@cdxoo/inline-text'),
    jsonify,
    omit,
    ejson,
    ObjectId,

    RootHandler: allHandlers,
}
