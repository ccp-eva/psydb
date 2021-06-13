'use strict';
var expect = require('chai').expect,
    Ajv = require('ajv'),
    unmarshalDateOnlyServerSide = require('./unmarshal-date-only-server-side');

describe('unmarchal-date-time', () => {

    it('does the thing', () => {
        var schema = {
            type: 'object',
            properties: {
                theDate: {
                    type: 'string',
                    format: 'date',
                    unmarshalDateOnlyServerSide: true,
                }
            }
        }
        
        var ajv = Ajv({
            allErrors: true,
            verbose: true,
        });

        var validData = {
            theDate: '2020-01-01',
        };
        var invalidData = {
            theDate: 'adf',
        };
        //console.log(ajvFormats.get('date-time'))
        
        /*ajv.addFormat({
            validate: () => true
        })*/
        ajv.addKeyword(
            'unmarshalDateOnlyServerSide',
            unmarshalDateOnlyServerSide
        );

        expect(ajv.validate(schema, validData)).to.eql(true);
        expect(ajv.validate(schema, invalidData)).to.eql(false);

        console.log(validData)
        console.log(invalidData)

    });

});
