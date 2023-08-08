'use strict';

const chai = require('chai');
chai.use(require('chai-subset'));
// FIXME: moch-chai-jest-snapshot is stupid; and cant be loaded here
//chai.use(require('mocha-chai-jest-snapshot').jestSnapshotPlugin())

chai.config.truncateThreshold = 0;
