'use strict';
var expect = require('chai').expect,
    bq = require('@cdxoo/block-quote'),
    jsc2gql = require('./index');

describe('conversion of basic schemas', () => {
    it('converts basic object schema', () => {

        var schemas = {
            Test: {
                $id: 'basic/test.json',
                type: 'object',
                properties: {
                    id: {
                        type: 'integer'
                    },
                    name: {
                        type: 'string'
                    }  
                }
            }
        }
        
        var result = jsc2gql(schemas);
        console.log(result);
        expect(result).to.eql(bq`
            type Test {
                id: Int
                name: String
            }
        `);
    });

    it('handles basic nesting', () => {
        var schemas = {
            Test: {
                $id: 'basic/test.json',
                type: 'object',
                properties: {
                    id: {
                        type: 'integer'
                    },
                    foo: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        }

        var result = jsc2gql(schemas);
        console.log(result);
        expect(result).to.eql(bq`
            type Test {
                id: Int
                foo: TestFoo
            }
            type TestFoo {
                name: String
            }
        `);
    });
});
