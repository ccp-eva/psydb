'use strict';

// FIXME: ok thats stupid: it relies on before() etc hooks
// which are not yet set in tools/require-chai-addons
var chai = require('chai');
chai.use(require('chai-subset'));
chai.use(require('mocha-chai-jest-snapshot').jestSnapshotPlugin())

module.exports = chai;
