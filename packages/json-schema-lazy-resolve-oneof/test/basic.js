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

        var resolvedFalseSchema = lazyResolve(schema, { isEnabled: false });
        expect(resolvedFalseSchema).to.eql({
            type: 'object',
            properties: {
                isEnabled: {
                    type: 'boolean',
                    enum: [ false ]
                },
            }
        });

        var resolvedTrueSchema = lazyResolve(schema, { isEnabled: true });
        expect(resolvedTrueSchema).to.eql({
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
        });
    });
});
