'use strict';
class MongoRohrpostError extends Error {
    constructor (...args) {
        super(...args);
        this.name = 'MongoRohrpostError';
    }
};
class ChannelCreationFailed extends MongoRohrpostError {
    constructor (...args) {
        super(...args);
        this.name = 'ChannelCrationFailed';
    }
};
class ChannelUpdateFailed extends MongoRohrpostError {
    constructor (...args) {
        super(...args);
        this.name = 'ChannelUpdateFailed';
    }
};

module.exports = {
    MongoRohrpostError,
    ChannelCreationFailed,
    ChannelUpdateFailed,
};
