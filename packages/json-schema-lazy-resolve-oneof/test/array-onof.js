'use strict';
var chai = require('chai');

var expect = chai.expect,
    lazyResolve = require('../src/');

describe('array-in-oneof', () => {
    it('simple array prop', () => {
        var schema = {
            type: 'object',
            properties: {
                something: {
                    type: 'array',
                    items: {
                        type: 'object',
                        lazyResolveProp: 'foo',
                        oneOf: [
                            {
                                type: 'object',
                                properties: {
                                    foo: { type: 'string', const: 'foo' },
                                    ary: { type: 'array', 
                                        items: { type: 'string' }}
                                },
                            },
                            {
                                type: 'object',
                                properties: {
                                    foo: { type: 'string', const: 'bar' },
                                    ary: { type: 'array', 
                                        items: { type: 'number' }}
                                },
                            },
                        ]
                    }
                }
            }
        }

        var resolvedSchemas = lazyResolve(schema, {
            something: [
                {
                    foo: 'foo',
                    ary: [ 'a' ],
                },
                {
                    foo: 'bar',
                    ary: [ 1 ],
                }
            ]
        });
        console.dir(resolvedSchemas, { depth: null });
        return;

    });
})

