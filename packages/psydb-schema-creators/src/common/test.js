'use strict'
var { expect } = require('chai');
var fn = require('./metadata-fn');
var s = require('./metadata');

expect(
    fn({ apiConfig: {}})
).to.deep.equal(s);
