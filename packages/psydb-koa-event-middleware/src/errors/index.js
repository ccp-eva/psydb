'use strict';

class MessageHandlerNotFound extends Error {}
class MessageHandlerConflict extends Error {}
class InvalidDatabaseHandle extends Error {}
class InvalidMessage extends Error {}

module.exports = {
    MessageHandlerNotFound,
    MessageHandlerConflict,
    InvalidDatabaseHandle,
    InvalidMessage,
}
