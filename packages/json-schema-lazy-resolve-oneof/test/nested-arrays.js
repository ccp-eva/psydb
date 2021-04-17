'use strict';
var chai = require('chai');

var expect = chai.expect,
    lazyResolve = require('../src/');

describe('nested-arrays', () => {
    it('simple array prop', () => {
        var schema = {
            type: 'object',
            properties: {
                arys: {
                    type: 'array',
                    items: { type: 'string' }
                }
            }
        }

        var resolvedSchemas = lazyResolve(schema, {
            arys: [
                'foo', 'bar', 'baz',
            ]
        });
        console.dir(resolvedSchemas, { depth: null });
        return;

    });
    it('arrays within arrays', async () => {
        var schema = {
            type: 'object',
            properties: {
                arys: {
                    type: 'array',
                    items: {
                        type: 'array',
                        items: { type: 'string' }
                    }
                }
            }
        }

        var resolvedSchemas = lazyResolve(schema, {
            arys: [
                [ 'foo', 'bar', 'baz' ],
                [ 'a', 'b', 'c'],
            ]
        });
        console.dir(resolvedSchemas, { depth: null });
        return;
        var expected = [
            {
                type: 'schema',
                inSchemaPointer: '',
                schema: {
                    type: 'object',
                    properties: { arys: { type: 'array' } 
                }}
            },
            {
                type: 'array',
                inSchemaPointer: '/properties/arys',
                itemSchemas: [
                    { type: 'array' },
                    { type: 'array' },
                ]
            },
            {
                type: 'array',
                inSchemaPointer: '/properties/arys/items',
                itemSchemas: [
                    { type: 'string' },
                    { type: 'string' },
                    { type: 'string' },
                ]
            }
        ]

    });
})

