'use strict';
var expect = require('chai').expect,
    parse = require('./parse-record-message-type');

var ex = (op, collection, recordType, recordSubtype) => ({
    op, collection, recordType, recordSubtype
})

var data = [
    ['records/create/foo', ex('create', 'foo')],
    ['records/create/foo/bar', ex('create', 'foo', 'bar')],
    ['records/create/foo/bar/baz', ex('create', 'foo', 'bar', 'baz')]
];

describe('parse-record-message-type', () => {

    it('does the thing', () => {
        data.forEach(([ type, expected ]) => {
            console.log(type, expected);
            expect(parse(type)).to.eql(expected);
        })
    });

});
