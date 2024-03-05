'use strict';
var debug = require('debug')('psydb:driver-node-js');
var { inspect } = require('util');
var superagent = require('superagent');

var { jsonpointer, only } = require('@mpieva/psydb-core-utils');
var { getSystemTimezone } = require('@mpieva/psydb-timezone-helpers');

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
        var { data, status } = response;
        var errorMessage = `RequestFailed : ${status}`;
        var isApiError = !!data?.apiStatus;
        
        if (isApiError) {
            errorMessage = data.data.message;
        }

        super(errorMessage);
        this.name = 'RequestFailed';
        this.response = response;

        if (isApiError) {
            this.httpsStatusCode = data.statusCode;
            this.httpStatus = data.status;
            this.apiStatus = data.apiStatus;
            this.apiMessage = data.data.message;
            this.apiStack = data.data.stack;
        }

        //super(JSON.stringify(data, null, '\t'));

        //console.dir(body, { depth: null });
    }
}

var defaultWriteRequest = async ({ agent, url, message, options = {} }) => {
    var { forceTZ = false, apiKey } = options;
    url = maybeInjectApiKey({ url, apiKey })

    try {
        var body = {
            timezone: forceTZ || getSystemTimezone(),
            ...message,
        };
        debug(agent?.defaults?.baseURL, url, JSON.stringify(body));
        var { status, data } = await agent.post(url, body);
    }
    catch (e) {
        if (e.response) {
            throw new RequestFailed(e.response);
        }
        else {
            throw new Error(e);
        }
    }

    return { status, data };
}

var maybeInjectApiKey = ({ url, apiKey }) => {
    var out = (
        apiKey
        ? `${url}?apiKey=${apiKey}`
        : url
    );
    return out;
}

var Driver = (options) => {
    var {
        server,
        agent,
        customWriteRequest,
        apiKey: driverApiKey,
    } = options;

    if (!server && !agent) {
        throw new DriverError(
            'one of "server" or "agent" parameters must be set'
        )
    }

    var driver = {},
        cache = Cache();

    var writeRequest = customWriteRequest || defaultWriteRequest;
    agent = agent || createDefaultAgent(server);

    // FIXME: duh
    driver.post = async (bag) => {
        var { url, payload, apiKey = driverApiKey } = bag;
        url = maybeInjectApiKey({ url, apiKey });

        try {
            var response = await agent.post(url, payload);
            return response.data;
        }
        catch (e) {
            if (e.response?.data?.data) {
                console.error(
                    inspect(
                        e.response.data.data,
                        { depth: null, colors: true }
                    )
                )
                throw new Error('BadRequest')
            }
            else {
                throw e;
            }
        }
    };

    driver.get = async (bag) => {
        var { url, payload, apiKey = driverApiKey } = bag;
        url = maybeInjectApiKey({ url, apiKey });
        
        return agent.get(url)
    };
    // FIXME:

    driver.signIn = ({ email, password }) => (
        writeRequest({ agent, url: '/sign-in', message: {
            email, password
        }})
    )

    driver.signOut = () => (
        writeRequest({ agent, url: '/sign-out' })
    )

    driver.sendMessage = async (message, options = {}) => {
        var { apiKey = driverApiKey, ...otherOptions } = options;
        try {
            var { status, data } = await writeRequest({
                agent, url: '/', message, options: {
                    apiKey, ...otherOptions
                }
            });

            var modified = data.data;
            for (var it of modified) {
                cache.setLastChannelId({ ...it });
                cache.setLastKnownEventId({ ...it });
            }

            return { status, data };
        }
        catch (e) {
            if (e instanceof RequestFailed) {

                if (e.response.status === 400) {
                    // NOTE: i could potentially overwrite stack
                    // and put additional info there, but that would
                    // pretty hacky and would break stuff that
                    // relies on stack being a specific format
                    // NOTE: mabe at least instead of console
                    // use debug
                    console.log(
                        'REQUEST CONFIG:',
                        only({ from: e.response.config, paths: [
                            'baseURL', 'url', 'data'
                        ]})
                    );
                    
                    console.error(
                        'ERROR REPONSE DATA:',
                        inspect(
                            e.response.data.data,
                            { depth: null, colors: true }
                        )
                    );

                    //console.error(
                    //    'API ERROR STACK:',
                    //    e.apiStack
                    //);
                    //console.error(
                    //    'AJV ERRORS:',
                    //    inspect(
                    //        e.response.data.data.ajvErrors,
                    //        { depth: null, colors: true }
                    //    )
                    //);
                    throw new Error('BadRequest')
                }
                else {
                    throw e;
                }
            }
            else {
                throw e;
            }
        }
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

    driver.getCache = () => {
        return cache; 
    }

    return driver;
}

Driver.errors = {
    DriverError,
    RequestFailed
}

module.exports = Driver;
