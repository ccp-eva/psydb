'use strict';
var expect = require('chai').expect,
    regex = require('./message-type-regex');

var data = [
    ['records/create/foo/bar', true],
    ['records/create/location/room/bar', true],
    
    ['records/create/foo', false],
    ['records/create/foo/bar/baz', false],
    ['records/create/location/room', false],
    ['records/create/location/building', false],
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
