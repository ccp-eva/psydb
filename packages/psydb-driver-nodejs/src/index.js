'use strict';
var superagent = require('superagent'),
    jsonpointer = require('jsonpointer');

var createDefaultAgent = (server) => (
    superagent.agent(server)
);

var Cache = () => {
    var cache = {};
    
    cache.lastKnownEventIds = {};
    cache.lastChannelIds = {};

    cache.setLastKnownEventId = ({
        collectionName, subChannelKey, channelId, lastKnownEventId
    }) => {
        var path = (
            subChannelKey === undefined
            ? `/${collectionName}/${channelId}`
            : `/${collectionName}/${subChannelKey}/${channelId}`
        );
        jsonpointer.set(
            cache.lastKnownEventIds,
            path,
            eventId
        );
    }

    cache.setLastChannelId = ({
        collectionName, channelId
    }) => {
        cache.lastChannelId[collectionName] = channelId;
    }

    cache.clear = () => {
        cache.lastKnownEventIds = {};
        cache.lastChannelIds = {};
    }

    return cache;
}

class DriverError extends Error {
    constructor (...args) {
        super(...args);
        this.name = 'DriverError';
    }
}

class RequestFailed extends DriverError {
    constructor ({ status, body }) {
        super(body.data.message);
        this.name = 'RequestFailed';
    }
}

var defaultWriteRequest = async ({ agent, url, message }) => {
    var { status, body } = await agent.post(url).send(message);
    if (status !== 200) {
        throw new RequestFailed({ status, body });
    }
    return { status, body };
}

var Driver = ({
    server,
    agent,
    customWriteRequest,
} = {}) => {

    if (!server && !agent) {
        throw new DriverError(
            'one of "server" or "agent" parameters must be set'
        )
    }

    var driver = {},
        cache = Cache();

    writeRequest = customWriteRequest || defaultWriteRequest;
    agent = agent || createDefaultAgent(server);

    driver.signIn = ({ email, password }) => (
        writeRequest({ agent, url: '/sign-in', message: {
            email, password
        }})
    )

    driver.signOut = () => (
        writeRequest({ agent, url: '/sign-out' })
    )

    driver.sendMessage = async (message) => {
        var { status, body } = writeRequest({ agent, url: '/', message });

        var modified = body.data;
        for (var it of modified) {
            cache.setLastChannelId({ ...it });
            cache.setLastKnownEventId({ ...it });
        }

        return { status, body };
    }

    driver.lastEventId = ({ collection, channel, subChannel }) => (
        cache.lastKnownEventIds[collection][channel][subChannel]
    )

    driver.lastChannelId = (channel) => (
        cache.lastChannelId[channel]
    )

    driver.clearCache = () => (
        cache.clear()
    )

    return driver;
}
