'use strict';
var { expect } = require('chai');
var PULL = require('./pull');

describe('rohrpost-channel-history/pull()', () => {
    it('single value pull', () => {
        var channel = {
            foo: [ 'bar', 'baz' ]
        }
        PULL(channel, { '/foo': 'bar' });
        expect(channel).to.deep.eql({
            foo: [ 'baz' ]
        })
    });
    it('multi value pull', () => {
        var channel = {
            foo: [ 'bar', 'baz', 'quux' ]
        }
        PULL(channel, { '/foo': { '/$in': [ 'bar', 'baz' ] }});
        expect(channel).to.deep.eql({
            foo: [ 'quux' ]
        })
    });
    it('obj pull', () => {
        var channel = {
            foo: [{ a: 'bar' }, { a: 'baz' }, { a: 'quux' }]
        }
        PULL(channel, { '/foo': { '/a': { '/$in': [ 'bar', 'baz' ] }}});
        expect(channel).to.deep.eql({
            foo: [{ a: 'quux' }]
        })
    });
    it('deep obj pull', () => {
        var channel = {
            foo: [{ a: { b: 'bar' }}, { a: { b: 'baz' }}, { a: { b: 'quux' }}]
        }
        PULL(channel, { '/foo': { '/a/b': { '/$in': [ 'bar', 'baz' ] }}});
        expect(channel).to.deep.eql({
            foo: [{ a: { b: 'quux' }}]
        })
    });
})
