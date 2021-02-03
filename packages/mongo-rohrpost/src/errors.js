'use strict';
class MongoRohrpostError extends Error {};
class ChannelCreationFailed extends MongoRohrpostError {};
class ChannelUpdateFailed extends MongoRohrpostError {};

module.exports = {
    MongoRohrpostError,
    ChannelCreationFailed,
    ChannelUpdateFailed,
};
