'use strict';
var { expect } = require('chai');
var ejson = require('@cdxoo/tiny-ejson');
var Ajv = require('ajv');
var unmarshal = require('./unmarshal-date-only-server-side');


var DefaultSchema = () => ({
    type: 'array',
    items: {
        type: ['string', 'object'],
        //format: 'date',
        unmarshalDateOnlyServerSide: true,
    }
});
        
var ajv = Ajv({ allErrors: true, verbose: true, passContext: true });
ajv.addKeyword('unmarshalDateOnlyServerSide', unmarshal);

describe('unmarshalDateOnlyServerSide', () => {

    it('does the thing', () => {
        var schema = DefaultSchema();

        var validData = [
            '2019-12-31T16:00:00.000Z',
        ];
        //var invalidData = {
        //    theDate: 'adf',
        //};
        //console.log(ajvFormats.get('date-time'))
        
        /*ajv.addFormat({
            validate: () => true
        })*/

        //console.log(validData)
        //console.log(invalidData)

        process.env.TZ = 'UTC';
        var context = {
            serverTimezone: 'UTC',
            clientTimezone: 'Asia/Kuala_Lumpur'
        }
        var compiled = ajv.compile(schema);
        var isValid = compiled.call(context, validData);
        expect(isValid).to.eql(true);
        console.log({ validData });

        //expect(ajv.validate.call(schema, validData)).to.eql(true);
        //expect(ajv.validate(schema, invalidData)).to.eql(false);
        expect(ejson(validData)).to.eql([
            { $date: '2020-01-01T00:00:00.000Z' }
        ])
    });

});
