'use strict';
var { expect } = require('chai');
var createSchemaDefaults = require('./create-schema-defaults');

describe('createSchemaDefaults()', () => {
    it('does the stuff', () => {
        var schema = {
            type: 'object',
            properties: {
                foo: { type: 'string', default: '' },
                bar: { type: 'object', properties: {
                    herp: { type: 'object', default: {}},
                    derp: { type: 'string' }
                }},
                ary: { type: 'array', default: [], items: {
                    type: 'object',
                    properties: { quux: { type: 'string', default: '' }},
                }},
                of: {
                    type: 'object',
                    oneOf: [
                        { type: 'object', properties: { quux: {
                            type: 'string', default: ''
                        }}}
                    ]
                },
            }
        }

        var defaults = createSchemaDefaults(schema);
        expect(defaults).to.deep.eql({
            foo: '',
            bar: { herp: {}},
            ary: []
        })
    });
})
