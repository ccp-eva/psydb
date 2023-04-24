'use strict';
var {
    ClosedObject,
    Id,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var internals = require('../');

var ApiKeyFullSchema = () => ClosedObject({
    _id: Id(),
    personnelId: ForeignId({ collection: 'personnel' }),
    apiKey: { type: 'string' },
    state: internals.ApiKeyState(),
})


module.exports = ApiKeyFullSchema;
