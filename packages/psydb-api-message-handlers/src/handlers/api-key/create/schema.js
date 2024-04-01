'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');
var { Message } = require('@mpieva/psydb-schema-helpers');
var { apiKey } = require('@mpieva/psydb-schema-creators');

var Schema = (context) => {
    var { permissions } = context;

    var schema = Message({
        type: 'apiKey/create',
        payload: ClosedObject({
            ...(permissions.isRoot() && {
                personnelId: ForeignId({ collection: 'personnel' }),
            }),
            props: apiKey.State()
        })
    });

    return schema;
}

module.exports = Schema;
