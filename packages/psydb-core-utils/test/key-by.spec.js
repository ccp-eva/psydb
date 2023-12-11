'use strict';
var { expect } = require('chai');
var { keyBy } = require('../src');

describe('keyBy()', () => {
    it('byProp', () => {
        var items = [
            { _id: 1, foo: 41 },
            { _id: 2, foo: 42 }
        ];
        var keyed = keyBy({ items, byProp: '_id' });

        expect(keyed).to.deep.eql({
            '1': { _id: 1, foo: 41 },
            '2': { _id: 2, foo: 42 },
        })
    });
    it('byPointer', () => {
        var items = [
            { _id: 1, foo: { bar: 41 }},
            { _id: 2, foo: { bar: 42 }}
        ];
        var keyed = keyBy({ items, byPointer: '/foo/bar' });

        expect(keyed).to.deep.eql({
            '41': { _id: 1, foo: { bar: 41 }},
            '42': { _id: 2, foo: { bar: 42 }}
        })
    });
    it('createKey', () => {
        var items = [
            { _id: 1, foo: 41 },
            { _id: 2, foo: 42 }
        ];
        var keyed = keyBy({ items, createKey: (it) => (
            'x' + it._id
        ) });

        expect(keyed).to.deep.eql({
            'x1': { _id: 1, foo: 41 },
            'x2': { _id: 2, foo: 42 },
        })
    });
    it('transform', () => {
        var items = [{ _id: 1, foo: 41 }, { _id: 2, foo: 42 }];
        var keyed = keyBy({ items, byProp: '_id', transform: (it) => (
            it.foo
        ) });

        expect(keyed).to.deep.eql({
            '1': 41,
            '2': 42,
        })
    })
})
