'use strict';
var { expect } = require('chai');
var { only } = require('../src');

describe('keyBy()', () => {
    it('paths', () => {
        var that = {
            foo: { bar: { baz: 42, nope: 'xxx' }},
            quux: 42,
            nope: 'xxx'
        };

        var out = only({
            from: that,
            paths: [
                'foo.bar.baz',
                'quux'
            ]
        });

        expect(out).to.deep.eql({
            foo: { bar: { baz: 42 }},
            quux: 42
        });
    });
    it('pointers', () => {
        var that = {
            foo: { bar: { baz: 42, nope: 'xxx' }},
            quux: 42,
            nope: 'xxx'
        };

        var out = only({
            from: that,
            pointers: [
                '/foo/bar/baz',
                '/quux'
            ]
        });

        expect(out).to.deep.eql({
            foo: { bar: { baz: 42 }},
            quux: 42
        });
    });
})
