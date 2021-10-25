'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var SimpleHandler = require('../../../lib/simple-handler');
var checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'subject-selector/remove',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message,
    cache
}) => {
    var { id } = message.payload;

    await checkForeignIdsExist(db, {
        'subjectSelector': [ id ]
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

    await db.collection('ageFrame').removeMany({
        subjectSelectorId: id
    });
    await db.collection('subjectSelector').removeOne({ _id: id });
}

module.exports = handler;
