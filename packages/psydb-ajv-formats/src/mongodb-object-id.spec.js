'use strict';
var expect = require('chai').expect,
    Ajv = require('ajv'),
    ajvFormats = require('ajv-formats');

describe('mongodb-oid', () => {

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

        console.log(ajvFormats.get('date-time'))
        
        /*ajv.addFormat({
            validate: () => true
        })*/
        var validData = {
            theDate: '2020-01-01T10:00:00.000Z',
        };
        var invalidData = {
            theDate: '2020-01-01 10:00:00',
        };
        ajv.addFormat('foo-time', ajvFormats.get('date-time'));

        console.log(new Date('2020-01-01T10:00:00.000Z'))
        console.log(new Date('2020-01-01 10:00:00'))


        expect(ajv.validate(schema, validData)).to.eql(true);
        expect(ajv.validate(schema, invalidData)).to.eql(false);

    });

});
