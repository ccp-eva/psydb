'use strict';
var { expect } = require('chai');
var { unwind } = require('../src');

describe('unwind()', () => {
    it('byPath (string, simple)', () => {
        var out = unwind({
            items: [
                { foo: 'bar', ary: [ 1,2 ] },
                { foo: 'quux', ary: [ 3,4 ] }
            ],
            byPath: 'ary'
        });
        
        expect(out).to.deep.eql([
            { foo: 'bar', ary: 1 },
            { foo: 'bar', ary: 2 },
            { foo: 'quux', ary: 3 },
            { foo: 'quux', ary: 4 },
        ]);
    });
    
    it('byPath (string, 2-dim)', () => {
        var out = unwind({
            items: [
                { x: [
                    { y: [ 1,2 ] }, 
                    { y: [ 3,4 ] }
                ]},
                { x: [
                    { y: [ 5,6 ] }, 
                    { y: [ 7,8 ] }
                ]},
            ],
            byPath: 'x.y'
        });
        
        expect(out).to.deep.eql([
            { x: { y: 1 }},
            { x: { y: 2 }},
            { x: { y: 3 }},
            { x: { y: 4 }},
            { x: { y: 5 }},
            { x: { y: 6 }},
            { x: { y: 7 }},
            { x: { y: 8 }},
        ]);
    });

    it('perf 100000', () => {
        var items = [];
        for (var i = 0; i < 100000; i += 1) {
            items.push({ x: [{ y: 1 }, { y: 2 }]})
        }
        var out = unwind({ items, byPath: 'x' })
    });
})
