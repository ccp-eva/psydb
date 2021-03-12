'use strict';
var chai = require('chai');

var expect = chai.expect,
    lazyResolve = require('../src/');

describe('complex-schema-behavior', () => {

    it('resolves schema properly', async () => {
        var schema = {
            lazyResolveProp: 'isEnabled',
            oneOf: [
                {
                    type: 'object',
                    properties: {
                        isEnabled: {
                            type: 'boolean',
                            enum: [ false ]
                        }
                    }
                },
                {
                    type: 'object',
                    properties: {
                        isEnabled: {
                            type: 'boolean',
                            enum: [ true ]
                        },
                        otherProp: {
                            type: 'string',
                        },
                        nested01: {
                            lazyResolveProp: 'type',
                            oneOf: [
                                { type: 'object', properties: {
                                    type: { const: 'foo' },
                                    fooName: { type: 'string' },
                                }},
                                { type: 'object', properties: {
                                    type: { const: 'bar' },
                                    barName: { type: 'string' },
                                }},
                                { type: 'object', properties: {
                                    type: { const: 'baz' },
                                    bazName: { type: 'string' },
                                }},
                            ]
                        },
                        nested02: {
                            lazyResolveProp: 'keyword',
                            oneOf: [
                                { type: 'object', properties: {
                                    keyword: { const: 'red' },
                                    redValue: { type: 'string' }
                                }},
                                { type: 'object', properties: {
                                    keyword: { enum: [ 'blue', 'green' ] },
                                    bgValue: { type: 'string' }
                                }},
                            ]
                        },
                        // FIXME: cant be done for arrays but only per
                        // individual element
                        // => should be ignored
                        // <= we need a breakable traverse for this
                        ary01: {
                            type: 'array',
                            items: {
                                lazyResolveProp: 'type',
                                oneOf: [
                                    { type: 'object', properties: {
                                        type: { const: 'a' },
                                        aValue: { type: 'string' }
                                    }},
                                    { type: 'object', properties: {
                                        type: { const: 'b' },
                                        bValue: { type: 'string' }
                                    }},
                                ]
                            }
                        }
                    }
                }
            ]
        }

        var resolvedSchemas = lazyResolve(schema, {
            isEnabled: true,
            nested01: {
                type: 'bar'
            },
            nested02: {
                keyword: 'blue',
            },
            ary01: [
                { type: 'b', bValue: 'baz' },
                { type: 'b', bValue: 'bar' },
                { type: 'a', bValue: 'foo' },
            ]
        });

        console.dir(resolvedSchemas, { depth: null });
        
        expect(resolvedSchemas).to.eql([
            {
                type: 'schema',
                inSchemaPointer: '',
                schema: {
                    type: 'object',
                    properties: {
                        isEnabled: {
                            type: 'boolean',
                            enum: [ true ]
                        },
                        otherProp: {
                            type: 'string',
                        },
                        nested01: {
                            type: 'object',
                            properties: {
                                type: { const: 'bar' },
                                barName: { type: 'string' },
                            }
                        },
                        nested02: {
                            type: 'object',
                            properties: {
                                keyword: { enum: [ 'blue', 'green' ] },
                                bgValue: { type: 'string' }
                            }
                        },
                        ary01: {
                            type: 'array'
                        }
                    }
                }
            },

            {
                type: 'array',
                inSchemaPointer: '/oneOf/1/properties/ary01',
                itemSchemas: [
                    { type: 'object', properties: {
                        type: { const: 'b' },
                        bValue: { type: 'string' }
                    }},
                    { type: 'object', properties: {
                        type: { const: 'b' },
                        bValue: { type: 'string' }
                    }},
                    { type: 'object', properties: {
                        type: { const: 'a' },
                        aValue: { type: 'string' }
                    }},
                ]
            }
        ]);
    });
});
