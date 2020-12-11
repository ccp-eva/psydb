'use strict';
var expect = require('chai').expect,
    calculateState = require('./calculate-state');

var events = [
    { message: {
        type: 'put',
        payload: { prop: '/foo', value: 42 },
    }},
    { message: {
        type: 'put',
        payload: { prop: '/bar/baz', value: 43 },
    }},
];

describe('calculate-state', () => {

    it('does the thing', () => {
        var state = calculateState({
            events,
            createDefaultState: () => ({ initial: 1 }),
        });
        expect(state).to.eql({
            initial: 1,
            foo: 42,
            bar: { baz: 43 }
        });
    });

});
