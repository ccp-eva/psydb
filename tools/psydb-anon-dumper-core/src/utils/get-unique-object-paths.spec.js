'use strict';
var { expect } = require('chai');
var { all: stringify} = require('@cdxoo/stringify-path-perlstyle');
var getUniqueObjectPaths = require('./get-unique-object-paths');

describe('getUniqueObjectPaths()', () => {
    it('doit', () => {
        var paths = getUniqueObjectPaths({
            foo: { bar: 42 },
            ary: [
                { x: 1 },
                { x: 2 },
                { nary: [ { a: 1 }, { b: 1 } ]}
            ],
            obj: { '9001': 1 }
        });

        console.log(stringify(paths));
        expect(stringify(paths)).to.eql([
            '%foo',
            '%foo -> $bar',
            '@ary',
            '@ary -> $x',
            '@ary -> @nary',
            '@ary -> @nary -> $a',
            '@ary -> @nary -> $b',
            '%obj',
            '%obj -> $9001'
        ]);
    });
})
