'use strict';
var chai = require('chai');

var expect = chai.expect,
    lazyResolve = require('../src/');

describe('reservation-settings-issue', () => {
    it('works', () => {

        var schema = { type: 'object', properties: {
            res: {
                type: 'object',
                lazyResolveProp: 'enabled',
                oneOf: [
                    { type: 'object', properties: {
                        enabled: { type: 'boolean', const: false }
                    }},
                    { type: 'object', properties: {
                        enabled: { type: 'boolean', const: true },
                        ary: { type: 'array', items: (
                            { type: 'object', properties: {
                                foo: { type: 'string' }
                            }}
                        )}
                    }},
                ]
            }
        }}

        var resolvedSchemas = lazyResolve(schema, {
            res: {
                enabled: true,
                ary: [ 'a', 'b', 'c'],
            }
        });
        console.dir(resolvedSchemas, { depth: null });

    })
})
