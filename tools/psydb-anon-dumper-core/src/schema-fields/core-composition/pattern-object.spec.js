'use strict';
var { expect } = require('chai');
var Anonymizer = require('../../anonymizer');
var { AnyString } = require('../scalar');
var PatternObject = require('./pattern-object');

describe('PatternObject()', () => {
    it('doit', () => {
        var schema = PatternObject({
            '^[0-9]{4}$': AnyString({ anonKeep: true }),
            '^[a]+$': AnyString({ anonT: 'append' }),
            '^nested$': PatternObject({
                '^quu[xy]$': AnyString({ anonT: 'Q' }),
            }),
            '^n+$': AnyString({ anonKeep: false })
        })

        var jss = schema.createJSONSchema();
        console.dir({ jss }, { depth: null });

        var a = Anonymizer({ hooks: {
            'append': ({ value }) => `${value} APPEND`,
            'Q': ({ value }) => `${value} Q`
        }});

        var T = schema.transformValue({
            transform: a.anonymize,
            value: {
                '2002': 'foo 2002',
                '2003': 'foo 2003',
                
                'aaaa': 'a4',
                'aaaaa': 'a5',

                'nested' : {
                    'quux': 'qx',
                    'quuy': 'qx',
                },

                'nnnn': 'n4',
                'nnnnn': 'n5',
            }
        })

        console.log(T.value);
    });
})
