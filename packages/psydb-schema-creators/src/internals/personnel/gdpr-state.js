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
            firstname: SaneString({ title: 'Vorname' }),
            lastname: SaneString({ title: 'Nachname' }),
            
            // TODO: find out if thats even needed
            /*address: Address({
                required: []
            }),*/
            
            emails: EmailList({
                title: 'E-Mail',
                minItems: 0
            }),
            phones: PhoneList({
                title: 'Telefon',
                minItems: 0
            }),
            
            description: FullText({
                title: 'Beschreibung',
                minLength: 0,
            }),

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
