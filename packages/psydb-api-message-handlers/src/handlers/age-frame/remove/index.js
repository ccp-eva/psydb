'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var SimpleHandler = require('../../../lib/simple-handler');
var checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'ageFrame/remove',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message,
    cache
}) => {
    // TODO: permissions
    var { id } = message.payload;

    await checkForeignIdsExist(db, {
        'ageFrame': [ id ]
    });
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
}) => {
    var { payload } = message;
    var { id } = payload;

    await db.collection('ageFrame').removeOne({ _id: id });
}

module.exports = handler;
