'use strict';
var { expect } = require('chai');
var Anonymizer = require('../../anonymizer');
var { AnyString } = require('../scalar');
var OneOf = require('./one-of');
var ExactObject = require('./exact-object');
var DefaultArray = require('./default-array');

describe('OneOf()', () => {
    it('doit', () => {
        var schema = OneOf({
            discriminate: ({ value }) => (
                value === 'foo' ? 'foo' : 'other'
            ),
            schemas: {
                'foo': AnyString({ anonT: 'append' }),
                'other': AnyString()
            }
        });

        //var jss = schema.createJSONSchema();
        //console.dir({ jss }, { depth: null });

        var a = Anonymizer({ hooks: {
            'append': ({ value }) => `${value} APPEND`
        }})
        var T = schema.transformValue({
            transform: a.anonymize,
            value: 'foo'
        })
        
        //console.log({ T });
        
        expect(T).to.eql({
            shouldStore: true,
            value: 'foo APPEND'
        })
        
        
        var T = schema.transformValue({
            transform: a.anonymize,
            value: 'bar'
        })

        //console.log({ T });

        expect(T).to.eql({
            shouldStore: undefined,
        })
        
    });
    
    it('objects ok', () => {
        var schema = OneOf({
            discriminate: ({ value }) => (
                typeof value
            ),
            schemas: {
                'string': AnyString({ anonT: 'append' }),
                'object': ExactObject({
                    'foo': AnyString({ anonT: 'append' }),
                })
            }
        });

        //var jss = schema.createJSONSchema();
        //console.dir({ jss }, { depth: null });

        var a = Anonymizer({ hooks: {
            'append': ({ value }) => `${value} APPEND`
        }})
        var T = schema.transformValue({
            transform: a.anonymize,
            value: { foo: 'foo' }
        })

        //console.log({ T });

        expect(T).to.eql({
            shouldStore: true,
            value: { foo: 'foo APPEND' }
        })
    });
    
    it('arrays ok', () => {
        var schema = OneOf({
            discriminate: ({ value }) => (
                Array.isArray(value) ? 'array': 'string'
            ),
            schemas: {
                'string': AnyString({ anonT: 'append' }),
                'array': DefaultArray({
                    items: AnyString({ anonT: 'append' }),
                })
            }
        });

        //var jss = schema.createJSONSchema();
        //console.dir({ jss }, { depth: null });

        var a = Anonymizer({ hooks: {
            'append': ({ value }) => `${value} APPEND`
        }})
        var T = schema.transformValue({
            transform: a.anonymize,
            value: [ 'foo', 'bar' ]
        });

        //console.log({ T });

        expect(T).to.eql({
            shouldStore: true,
            value: [ 'foo APPEND', 'bar APPEND' ]
        })
    });
})
