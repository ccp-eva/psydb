'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var SimpleHandler = require('../../../lib/simple-handler');
var checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment-variant-setting/remove',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message,
    cache
}) => {
    // TODO: check permissions
    var { id } = message.payload;

    await checkForeignIdsExist(db, {
        'experimentVariantSetting': [ id ]
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

    await db.collection('experimentVariantSetting').removeOne({ _id: id });
}

module.exports = handler;
