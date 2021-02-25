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
    { message: {
        type: 'put',
        payload: { prop: '/ary', value: [1,2,3] }
    }},
    { message: {
        type: 'push',
        payload: { prop: '/ary', value: 4 }
    }},
    { message: {
        type: 'remove',
        payload: { prop: '/ary/1' }
    }},
    { message: {
        type: 'put',
        payload: { prop: '/obj', value: { a: 1, b: 2, c: 3 }}
    }},
    { message: {
        type: 'remove',
        payload: { prop: '/obj/b' }
    }},
];

describe('calculate-state', () => {

    it('does the thing', () => {
        var { nextState } = calculateState({
            events,
            createDefaultState: () => ({ initial: 1 }),
        });
        expect(nextState).to.eql({
            initial: 1,
            foo: 42,
            bar: { baz: 43 },
            ary: [ 1,3,4 ],
            obj: { a: 1, c: 3 }
        });
    });

});
