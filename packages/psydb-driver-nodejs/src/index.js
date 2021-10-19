'use strict';
var superagent = require('superagent'),
    jsonpointer = require('jsonpointer');

var createDefaultAgent = (server) => (
    superagent.agent(server)
);

var Cache = () => {
    var cache = {};
    
    cache.lastKnownEventIds_short = {};
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
            lastKnownEventId
        );
        var path_short = (
            subChannelKey === undefined
            ? `/${channelId}`
            : `/${channelId}/${subChannelKey}`
        );
        jsonpointer.set(
            cache.lastKnownEventIds_short,
            path_short,
            lastKnownEventId
        );
    }

    cache.setLastChannelId = ({
        collectionName, channelId
    }) => {
        cache.lastChannelIds[collectionName] = channelId;
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
    constructor (response) {
        var { body, status } = response;
        super(body.data.message);
        this.name = 'RequestFailed';
        this.response = response;

        console.dir(body, { depth: null });
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

    var writeRequest = customWriteRequest || defaultWriteRequest;
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
        var { status, body } = await writeRequest({
            agent, url: '/', message
        });

        var modified = body.data;
        for (var it of modified) {
            cache.setLastChannelId({ ...it });
            cache.setLastKnownEventId({ ...it });
        }

        return { status, body };
    }

    driver.lastEventId = ({ collection, channel, subChannel }) => {
        return (
            subChannel
            ? cache.lastKnownEventIds[collection][subChannel][channel]
            : cache.lastKnownEventIds[collection][channel]
        );
    }

    driver.lastEventId_short = ({ channel, subChannel }) => {
        return (
            subChannel
            ? cache.lastKnownEventIds_short[channel][subChannel]
            : cache.lastKnownEventIds_short[channel]
        );
    }

    driver.lastChannelId = (channel) => (
        cache.lastChannelIds[channel]
    )

    driver.clearCache = () => (
        cache.clear()
    )

    return driver;
}

Driver.errors = {
    DriverError,
    RequestFailed
}

module.exports = Driver;
