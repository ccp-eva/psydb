'use strict';
var chai = require('chai');

var expect = chai.expect,
    lazyResolve = require('../src/');

describe('basic-behavior', () => {

    it('core functionality', async () => {
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
                        [1]: {
                            type: 'string',
                        },
                        otherProp: {
                            type: 'string',
                        }
                    }
                }
            ]
        }

        var resolvedFalseSchemas = lazyResolve(schema, { isEnabled: false });
        console.dir(resolvedFalseSchemas);
        expect(resolvedFalseSchemas).to.eql([
            {
                type: 'schema',
                inSchemaPointer: '',
                schema: {
                    type: 'object',
                    properties: {
                        isEnabled: {
                            type: 'boolean',
                            enum: [ false ]
                        },
                    }
                }
            }
        ]);

        var resolvedTrueSchemas = lazyResolve(schema, { isEnabled: true });
        console.dir(resolvedTrueSchemas);
        expect(resolvedTrueSchemas).to.eql([
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
                        [1]: {
                            type: 'string',
                        },
                        otherProp: {
                            type: 'string',
                        }
                    }
                }
            }
        ]);

    });
});
