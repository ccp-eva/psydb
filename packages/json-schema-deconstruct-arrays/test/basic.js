'use strict';
var chai = require('chai');

var expect = chai.expect,
    deconstructArrays = require('../src/');

describe('basic-behavior', () => {

    it('core functionality', async () => {
        var schema = {
            type: 'object',
            properties: {
                ary01: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            foo: { type: 'string' },
                            bar: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        baz: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                },
                ary02: {
                    type: 'array',
                    items: { type: 'object' }
                }
            }
        }

        var parts = deconstructArrays(schema);
        console.dir(parts, { depth: null });
        expect(parts).to.eql([
            {
                inSchemaPointer: '',
                schema: {
                    type: 'object',
                    properties: {
                        ary01: { type: 'array' },
                        ary02: { type: 'array' },
                    }
                }
            },
            {
                inSchemaPointer: '/properties/ary01',
                schema: {
                    type: 'object',
                    properties: {
                        foo: { type: 'string' },
                        bar: { type: 'array' }
                    }
                }
            },
            {
                inSchemaPointer: '/properties/ary01/items/properties/bar',
                schema: {
                    type: 'object',
                    properties: {
                        baz: { type: 'string' }
                    }
                }
            },
            {
                inSchemaPointer: '/properties/ary02',
                schema: {
                    type: 'object'
                }
            }
        ]);

    });
});
