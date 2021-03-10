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
                        /*ary01: {
                            type: 'array',
                            items: {
                                oneOf: [
                                    { type: 'object', properties: {
                                        keyword: { const: 'red' },
                                        redValue: { type: 'string' }
                                    }},
                                ]
                            }
                        }*/
                    }
                }
            ]
        }

        var resolvedSchema = lazyResolve(schema, {
            isEnabled: true,
            nested01: {
                type: 'bar'
            },
            nested02: {
                keyword: 'blue',
            }
        });

        console.dir(resolvedSchema, { depth: null });
        
        expect(resolvedSchema).to.eql({
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
                }
            }
        });
    });
});
