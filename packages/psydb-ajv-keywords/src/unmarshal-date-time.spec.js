'use strict';
var expect = require('chai').expect,
    Ajv = require('ajv'),
    unmarshalDateTime = require('./unmarshal-date-time');

describe('date-time-z', () => {

    it('does the thing', () => {
        var schema = {
            type: 'object',
            properties: {
                theDate: {
                    type: 'string',
                    format: 'date-time',
                    unmarshalDateTime: true,
                }
            }
        }
        
        var ajv = Ajv({
            allErrors: true,
            verbose: true,
        });

        console.log(unmarshalDateTime);

        var validData = {
            theDate: '2020-01-01T10:00:00.000Z',
        };
        var invalidData = {
            theDate: 'adf',
        };
        //console.log(ajvFormats.get('date-time'))
        
        /*ajv.addFormat({
            validate: () => true
        })*/
        ajv.addKeyword('unmarshalDateTime', unmarshalDateTime);

        expect(ajv.validate(schema, validData)).to.eql(true);
        expect(ajv.validate(schema, invalidData)).to.eql(false);

        console.log(validData)
        console.log(invalidData)

    });

});
