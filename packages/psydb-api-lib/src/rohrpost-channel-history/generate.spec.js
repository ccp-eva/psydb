'use strict';
var { expect } = require('chai');
var generate = require('./generate');

describe('rohrpost-channel-history/generate()', () => {
    it('does the stuff', () => {
        var events = [
            {
                timestamp: 1,
                isNewChannel: true,
                additionalChannelProps: { userId: 1234 },
                message: { payload: {
                    '/$set': { '/state/bar': 42 }
                }}
            },
            { timestamp: 2, message: { payload: {
                '/$set': { '/state/bar': 43, '/state/baz': 44 }
            }}},
            { timestamp: 3, message: { payload: {
                '/$push': { '/state/ary': { '/$each': [ 1,2 ]}}
            }}},
            { timestamp: 4, message: { payload: {
                '/$unset': { '/state/bar': true }
            }}},
        ]
        
        var history = generate({ events });

        expect(history).to.deep.eql([
            {
                event: {
                    timestamp: 1,
                    isNewChannel: true,
                    additionalChannelProps: { userId: 1234 },
                    message: { payload: {
                        '/$set': { '/state/bar': 42 }
                    }},
                },
                version: {
                    userId: 1234,
                    state: { bar: 42 }
                }
            },
            {
                event: {
                    timestamp: 2,
                    message: { payload: {
                        '/$set': { '/state/bar': 43, '/state/baz': 44 }
                    }},
                },
                version: {
                    userId: 1234,
                    state: { bar: 43, baz: 44 }
                }
            },
            {
                event: {
                    timestamp: 3,
                    message: { payload: {
                        '/$push': { '/state/ary': { '/$each': [ 1,2 ]}}
                    }},
                },
                version: {
                    userId: 1234,
                    state: { bar: 43, baz: 44, ary: [ 1,2 ] }
                }
            },
            {
                event: {
                    timestamp: 4,
                    message: { payload: {
                        '/$unset': { '/state/bar': true }
                    }},
                },
                version: {
                    userId: 1234,
                    state: { baz: 44, ary: [ 1,2 ] }
                }
            }
        ])
    });
})
