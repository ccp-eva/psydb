'use strict';
var {
    ExactObject,
    Integer,
    DefaultBool,
    Id,
} = require('@mpieva/psydb-schema-fields');

var GdprState = require('./gdpr-state');
var ScientificState = require('./scientific-state');

var FullSchema = (bag = {}) => {
    var { subChannelCustomRecordFieldDefinitions, ...pass } = bag;
    return ExactObject({
        properties: {
            _id: Id(),
            sequenceNumber: Integer(),
            onlineId: {
                systemType: 'SaneString', // FIXME
                type: 'string'
            },
            gdpr: ExactObject({
                properties: {
                    state: GdprState({
                        customFieldDefinitions: (
                            subChannelCustomRecordFieldDefinitions.gdpr
                        ),
                        ...pass,
                    }),
                }
            }),
            scientific: ExactObject({
                properties: {
                    state: ScientificState({
                        customFieldDefinitions: (
                            subChannelCustomRecordFieldDefinitions.scientific
                        ),
                        ...pass,
                    })
                }
            }),
        },
        required: [ 'isDummy' ],
    });
}

module.exports = FullSchema;
