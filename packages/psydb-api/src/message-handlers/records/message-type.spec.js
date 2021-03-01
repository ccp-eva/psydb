'use strict';
var expect = require('chai').expect,
    regex = require('./message-type');

var data = [
    ['records/create/foo/bar', true],
    ['records/patch/foo/bar', true],
    ['records/create/location/school', true],
    ['records/patch/location/classroom', true],
    ['records/create/systemRole', true],

    ['records/create/foo/bar/baz', false],
    ['records/create/location/building/baz/', false],
    ['records/create/location/building/baz/biz', false],
];

describe('message-type-regex', () => {

    it('does the thing', () => {
        data.forEach(([ type, expected ]) => {
            console.log(type, expected);
            expect(regex.test(type)).to.eql(expected);
        })
    });

});
