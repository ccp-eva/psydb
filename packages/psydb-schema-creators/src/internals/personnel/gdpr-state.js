'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ForeignId,
    EmailList,
    PhoneList,
    Address,
    FullText,
    SaneString,
    ExactObject,
} = require('@mpieva/psydb-schema-fields');

var PersonnelGdprState = ({ enableInternalProps } = {}) => {
    var schema = ExactObject({
        type: 'object',
        properties: {
            firstname: SaneString(),
            lastname: SaneString(),
            // TODO: decide if that should be stored in the scientific part
            //shorthand: SaneString(),
            shorthand: SaneString({ minLength: 2 }),
            
            // TODO: find out if thats even needed
            /*address: Address({
                required: []
            }),*/
            
            emails: EmailList({
                minItems: 1
            }),
            phones: PhoneList({
                minItems: 1
            }),
            
            // TODO: find out what thats good for
            //description: FullText(),

            // TODO: internals need to be separated
            // and put here when we read the record
            // but as they cant be written
            // ... not sure if that works when
            // we use prohibited though
            // => this works but the errors are
            // wierd, and im still not fully convinced
            // by the general approach
            // TODO: prohibited keyword should give
            // reasonable error message
            ...(enableInternalProps && {
                internals: ExactObject({
                    properties: {
                        /*passwordHash: {
                            type: 'string',
                            default: '',
                        },*/
                    },
                    required: [
                        //'passwordHash'
                    ],
                })
            })
        },
        required: [
            'firstname',
            'lastname',
            'shorthand',
            //'address',
            'emails',
            'phones',
            //'description',
            ...(
                enableInternalProps
                ? [ 'internals' ]
                : []
            )
        ],
    })

    return schema;
};

module.exports = PersonnelGdprState;
