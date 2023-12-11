'use strict';
var { expect } = require('chai');
var { groupBy } = require('../src');

describe('groupBy()', () => {
    it('byProp', () => {
        var items = [
            { _id: 1, foo: 41 },
            { _id: 2, foo: 42 },
            { _id: 3, foo: 42 }
        ];
        var grouped = groupBy({ items, byProp: 'foo' });

        expect(grouped).to.deep.eql({
            '41': [
                { _id: 1, foo: 41 },
            ],
            '42': [
                { _id: 2, foo: 42 },
                { _id: 3, foo: 42 }
            ]
        })
    });

    it('byPointer', () => {
        var items = [
            { _id: 1, foo: { bar: 41 }},
            { _id: 2, foo: { bar: 42 }},
            { _id: 3, foo: { bar: 42 }}
        ];
        var grouped = groupBy({ items, byPointer: '/foo/bar' });

        expect(grouped).to.deep.eql({
            '41': [
                { _id: 1, foo: { bar: 41 }},
            ],
            '42': [
                { _id: 2, foo: { bar: 42 }},
                { _id: 3, foo: { bar: 42 }}
            ]
        })
    });

    it('createKey', () => {
        var items = [
            { _id: 1, foo: 41 },
            { _id: 2, foo: 42 },
            { _id: 3, foo: 42 }
        ];
        var grouped = groupBy({ items, createKey: (it) => (
            'x' + it.foo
        ) });

        expect(grouped).to.deep.eql({
            'x41': [
                { _id: 1, foo: 41 },
            ],
            'x42': [
                { _id: 2, foo: 42 },
                { _id: 3, foo: 42 }
            ]
        })
    });
    it('transform', () => {
        var items = [
            { _id: 1, foo: 41 },
            { _id: 2, foo: 42 },
            { _id: 3, foo: 42 }
        ];
        var grouped = groupBy({ items, byProp: 'foo', transform: (it) => (
            it._id
        ) });

        expect(grouped).to.deep.eql({
            '41': [ 1 ],
            '42': [ 2, 3 ]
        })
    })
})
