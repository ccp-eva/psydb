'use strict';
var expect = require('chai').expect,
    FieldAccessMap = require('./field-access-map'),
    createFieldgroupProps = require('./create-fieldgroup-props');

describe('createFieldgroupProps()', () => {

    it('works when stateSchema is passed', () => {
        var fieldgroupProps = createFieldgroupProps({
            stateSchema: {
                type: 'object',
                properties: {
                    foo: 'string'
                }
            }
        });

        //console.dir(fieldgroupProps, { depth: null });

        expect(fieldgroupProps).to.eql({
            state: FieldAccessMap({ schema: {
                type: 'object',
                properties: {
                    foo: 'string'
                }
            }})
        });
    });


    it('works when scientificSchema is passed', () => {
        var fieldgroupProps = createFieldgroupProps({
            scientificSchemas: { state: {
                type: 'object',
                properties: {
                    foo: 'string'
                }
            }}
        });

        //console.dir(fieldgroupProps, { depth: null });

        expect(fieldgroupProps).to.eql({
            scientific: FieldAccessMap({ schema: {
                type: 'object',
                properties: {
                    foo: 'string'
                }
            }})
        });
    });
    
    it('works when scientificSchemas and gdprSchemas is passed', () => {
        var fieldgroupProps = createFieldgroupProps({
            scientificSchemas: { state: {
                type: 'object',
                properties: {
                    foo: 'string'
                }
            }},
            gdprSchemas: { state: {
                type: 'object',
                properties: {
                    bar: 'string'
                }
            }}
        });

        //console.dir(fieldgroupProps, { depth: null });

        expect(fieldgroupProps).to.eql({
            scientific: FieldAccessMap({ schema: {
                type: 'object',
                properties: {
                    foo: 'string'
                }
            }}),
            gdpr: FieldAccessMap({ schema: {
                type: 'object',
                properties: {
                    bar: 'string'
                }
            }})
        });
    });


});
