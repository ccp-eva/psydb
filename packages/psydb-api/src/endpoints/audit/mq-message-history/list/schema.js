'use strict';
var {
    ExactObject,
    SaneString,
    ForeignId,
    DateTimeInterval
} = require('@mpieva/psydb-schema-fields');

var { Pagination } = require('@mpieva/psydb-schema-fields-special');

var Schema = (bag = {}) => {
    var pagination = Pagination({ maxLimit: 1000 });

    return ExactObject({
        properties: {
            messageType: SaneString(),
            interval: DateTimeInterval(),
            triggeredBy: ForeignId({ collection: 'personnel' }),
            ...pagination.properties,
        },
        required: [
            ...pagination.required,
        ]
    })
}

module.exports = Schema;
