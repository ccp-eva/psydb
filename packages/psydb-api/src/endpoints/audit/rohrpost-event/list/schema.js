'use strict';
var {
    ExactObject,
    SaneString,
    ForeignId,
    Id,
    DateTimeInterval
} = require('@mpieva/psydb-schema-fields');

var { Pagination } = require('@mpieva/psydb-schema-fields-special');

var Schema = (bag = {}) => {
    var pagination = Pagination({ maxLimit: 1000 });

    return ExactObject({
        properties: {
            eventId: SaneString(),
            correlationId: SaneString(), // XXX
            triggeredBy: ForeignId({ collection: 'personnel' }),
            interval: DateTimeInterval(),

            channelId: SaneString(),
            collectionName: SaneString(), // XXX

            ...pagination.properties,
        },
        required: [
            ...pagination.required,
        ]
    })
}

module.exports = Schema;
