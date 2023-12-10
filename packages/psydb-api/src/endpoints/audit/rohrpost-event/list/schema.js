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
            correlationId: { type: 'string' }, // XXX
            interval: DateTimeInterval(),
            triggeredBy: ForeignId({ collection: 'personnel' }),

            channelId: Id(),
            collectionName: { type: 'string' }, // XXX

            ...pagination.properties,
        },
        required: {
            ...pagination.required,
        }
    })
}

module.exports = Schema;
