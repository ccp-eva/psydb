'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    SaneString,
    Address,
    FullText
} = require('@mpieva/psydb-schema-fields');

var ResearchGroupState = ({} = {}) => {
    var schema = ExactObject({
        properties: {
            name: SaneString({
                title: 'Bezeichnung',
                minLength: 1
            }),
            shorthand: SaneString({
                title: 'Kürzel',
                minLength: 1
            }),
            address: Address({
                title: 'Adresse',
                required: []
            }),
            description: FullText({
                title: 'Beschreibung',
            }),
            // TODO: permissions????
            // should they be readable to all?
            // and writable only to root accounts?
            // or normal read/write by researchgroup?
            // => readable to all writable to root
        },
        required: [
            'name',
            'shorthand',
            'address',
            'description'
        ]
    })

    return schema;
}

module.exports = ResearchGroupState;
