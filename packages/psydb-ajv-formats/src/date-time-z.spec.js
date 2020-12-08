'use strict';
var expect = require('chai').expect,
    Ajv = require('ajv'),
    formats = require('./formats');

describe('date-time-z', () => {

    it('does the thing', () => {
        var schema = {
            type: 'object',
            properties: {
                theDate: {
                    type: 'string',
                    format: 'foo-time'
                }
            }
        }
        
        var ajv = Ajv({
            allErrors: true,
            verbose: true,
        });

        console.log(formats.dateTimeZ);

        var validData = {
            theDate: '2020-01-01T10:00:00.000Z',
        };
        var invalidData = {
            theDate: '2020-01-01 10:00:00',
        };
        //console.log(ajvFormats.get('date-time'))
        
        /*ajv.addFormat({
            validate: () => true
        })*/
        ajv.addFormat('foo-time', formats.dateTimeZ);

        expect(ajv.validate(schema, validData)).to.eql(true);
        expect(ajv.validate(schema, invalidData)).to.eql(false);

    });

});
