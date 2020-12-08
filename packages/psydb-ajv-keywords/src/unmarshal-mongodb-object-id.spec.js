'use strict';
var expect = require('chai').expect,
    Ajv = require('ajv'),
    psydbFormats = require('@mpieva/psydb-ajv-formats'),
    unmarshalMongodbObjectId = require('./unmarshal-mongodb-object-id');

describe('date-time-z', () => {

    it('does the thing', () => {
        var schema = {
            type: 'object',
            properties: {
                theId: {
                    type: 'string',
                    format: 'mongo-oid',
                    unmarshalOid: true,
                }
            },
            required: [
                'theId',
            ]
        }
        
        var ajv = Ajv({
            allErrors: true,
            verbose: true,
        });

        var validData = {
            theId: '5fcb85b01672a70011c8c5bc',
        };
        var invalidData = {
            theId: 'adf',
        };
        //console.log(ajvFormats.get('date-time'))
        
        /*ajv.addFormat({
            validate: () => true
        })*/
        console.log(psydbFormats);
        ajv.addFormat('mongo-oid', psydbFormats.mongodbObjectId);
        ajv.addKeyword('unmarshalOid', unmarshalMongodbObjectId);

        expect(ajv.validate(schema, validData)).to.eql(true);
        expect(ajv.validate(schema, invalidData)).to.eql(false);

        console.log(validData)
        console.log(invalidData)

    });

});
