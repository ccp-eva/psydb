'use strict';
var expect = require('chai').expect,
    FieldAccess = require('./field-access'),
    FieldAccessMap = require('./field-access-map');

describe('FieldAccessMap()', () => {
    it('when no custom prop is there, only top level pointers', () => {
        var accessMap = FieldAccessMap({ schema: {
            type: 'object',
            properties: {
                foo: { type: 'string' },
                bar: { type: 'string' },
                internals: {
                    type: 'object',
                    properties: {
                        baz: { type: 'string' }
                    }
                }
            }
        }});

        expect(accessMap).to.eql({
            type: 'object',
            properties: {
                foo: FieldAccess({ implicitRead: false }),
                bar: FieldAccess({ implicitRead: false }),
            },
            required: [
                'foo',
                'bar'
            ]
        });
    });

    it('also creates custom pointers when custom prop exists', () => {
        var accessMap = FieldAccessMap({ schema: {
            type: 'object',
            properties: {
                foo: { type: 'string' },
                bar: { type: 'string' },
                custom: {
                    type: 'object',
                    properties: {
                        one: { type: 'string' },
                        two: { type: 'string' },
                    },
                },
                internals: {
                    type: 'object',
                    properties: {
                        baz: { type: 'string' }
                    }
                }
            }
        }});

        expect(accessMap).to.eql({
            type: 'object',
            properties: {
                foo: FieldAccess({ implicitRead: false }),
                bar: FieldAccess({ implicitRead: false }),
                custom: {
                    type: 'object',
                    properties: {
                        one: FieldAccess({ implicitRead: false }),
                        two: FieldAccess({ implicitRead: false }),
                    },
                    required: [
                        'one',
                        'two'
                    ]
                }
            },
            required: [
                'foo',
                'bar',
                'custom',
            ]
        });
    });
})
