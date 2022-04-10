'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { SimpleHandler } = require('../../../lib');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment/followup-subject-inhouse',
    createSchema,
});

handler.checkAllowedAndPlausible = require('./check-allowed-and-plausible');
handler.triggerSystemEvents = require('./trigger-system-events');

module.exports = handler;
