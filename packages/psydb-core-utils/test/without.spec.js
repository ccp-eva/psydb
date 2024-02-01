'use strict';
var { expect } = require('chai');
var { without } = require('../src');

describe('without()', () => {
    it('call with args', () => {
        var out = without(
            [ 1,2,3,4 ],
            [ 1,3 ]
        );

        expect(out).to.deep.eql([ 2,4 ])
    });
    it('call with bag', () => {
        var out = without({
            that: [ 1,2,3,4 ],
            without: [ 1,3 ]
        });
        
        expect(out).to.deep.eql([ 2,4 ])
    });
})
