'use strict';
var {
    ExactObject,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var State = require('./state');

var FullSchema = () => ExactObject({
    properties: {
        // FIXME: common props such as _id, lastEventId, lastModified etc
        setId: ForeignId({ collection: 'helperSet' }),
        state: State()
    },
    required: [
        'setId',
        'state',
    ]
});

module.exports = FullSchema;
