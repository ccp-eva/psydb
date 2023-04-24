'use strict';
var { ClosedObject } = require('@mpieva/psydb-schema-fields');
var { Message } = require('@mpieva/psydb-schema-helpers');
var { apiKey } = require('@mpieva/psydb-schema-creators');

var Schema = () => {
    return Message({
        type: 'apiKey/create',
        payload: ClosedObject({
            props: apiKey.State()
        })
    });
}

module.exports = Schema;
