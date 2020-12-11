'use strict';
var expect = require('chai').expect,
    recalculateState = require('./recalculate-state');

var ex = (op, collection, recordType, recordSubtype) => ({
    op, collection, recordType, recordSubtype
})

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

describe('parse-record-message-type', () => {

    it('does the thing', () => {
        var state = recalculateState({
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
