'use strict';
var expect = require('chai').expect,
    Ajv = require('ajv'),
    foreignKey = require('./foreign-key');

describe('foreign-key', () => {

    it('does the thing', () => {
        var schema = {
            type: 'object',
            properties: {
                someprop: {
                    oneOf: [
                        {
                            type: 'object',
                            properties: {
                                theFK: {
                                    type: 'string',
                                    foreignKey: {
                                        collection: 'foo',
                                        recordType: 'some-foo',
                                        constraints: {
                                            '.state.someNumber': { $gt: 10 }
                                        }
                                    }
                                }
                            }
                        },
                        { type: 'number' }
                    ]
                }
            }
        }
        
        var ajv = Ajv({
            allErrors: true,
            verbose: true,
            passContext: true,
        });

        console.log(foreignKey);

        var validData = {
            someprop: {
                theFK: '123456',
            }
        };
        var invalidData = {
            someprop: 'invalid'
        };
        //console.log(ajvFormats.get('date-time'))
        
        /*ajv.addFormat({
            validate: () => true
        })*/
        ajv.addKeyword('foreignKey', foreignKey);

        var context = {};
        var validate = ajv.compile(schema);
        var isValid = validate.call(context, validData);
        console.dir(context, { depth: null });
        expect(isValid).to.equal(true);
        console.log(validData);
    });

    it('for arrays', () => {
        var schema = {
            type: 'object',
            properties: {
                arrayofobjects: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            someid: {
                                type: 'string',
                                foreignKey: {
                                    collection: 'foo',
                                    recordType: 'some-foo',
                                }
                            }
                        }
                    }
                },
                arrayofstrings: {
                    type: 'array',
                    items: {
                        type: 'string',
                        foreignKey: {
                            collection: 'foo',
                            recordType: 'some-foo',
                        }
                    }
                }
            }
        };
        
        var ajv = Ajv({
            allErrors: true,
            verbose: true,
            passContext: true,
        });

        ajv.addKeyword('foreignKey', foreignKey);

        var validData = {
            arrayofobjects: [
                { someid: '123456' },
                { someid: '234567' },
            ],
            arrayofstrings: [
                '111',
                '222'
            ]
        };

        // =>
        // db.collection('foo')
        // .find({
        //     type: 'some-foo',
        //     _id: { $in: [ arrayofobjects[0].someid, ...] }
        // })

        var context = {};
        var validate = ajv.compile(schema);
        var isValid = validate.call(context, validData);

        console.dir(context, { depth: null });
    })

});
