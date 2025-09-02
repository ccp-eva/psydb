'use strict';
var debug = require('debug')('psydb:driver-nodejs');
var { inspect } = require('util');

var { only } = require('@mpieva/psydb-core-utils');
var { getSystemTimezone } = require('@mpieva/psydb-timezone-helpers');
var createNodeAgent = require('@mpieva/psydb-axios-wrapper-nodejs');

var { DriverError, RequestError, ApiError } = require('./errors');
var Cache = require('./cache');

var maybeInjectApiKey = require('./maybe-inject-api-key');
var defaultWriteRequest = require('./default-write-request');
var inter = require('./interface');

var defaultI18N = {
    language: 'en', locale: 'en_US',
    timezone: getSystemTimezone()
}

var Driver = (options) => {
    var {
        target,
        server,
        agent,
        customWriteRequest, // FIXME: why do i need that?

        apiKey: driverApiKey,
        i18n: driverI18N,
    } = options;

    driverI18N = { ...defaultI18N, ...driverI18N };

    if (server) {
        console.warn('using "server" is deprecated, use "target" instead');
        target = server;
    }

    if (!target && !agent) {
        throw new DriverError(
            'one of "target" or "agent" parameters must be set'
        )
    }

    var driver = {};
    var cache = Cache();

    var writeRequest = customWriteRequest || defaultWriteRequest;
    agent = agent || createNodeAgent(target);

    // FIXME: duh
    driver.post = async (bag) => {
        var { url, payload, options = {} } = bag;
        var {
            apiKey = driverApiKey, i18n = driverI18N,
            ...otherOptions
        } = options;

        try {
            var response = await writeRequest({
                agent, url, payload, options: {
                    apiKey, i18n, ...otherOptions
                }
            });
        }
        catch (e) {
            if (e.response?.data?.data) {
                console.error(
                    inspect(
                        e.response.data.data,
                        { depth: null, colors: true }
                    )
                )
            }

            throw e;
        }

        return response.data;
    };

    driver.get = async (bag) => {
        var { url, payload, apiKey = driverApiKey } = bag;
        url = maybeInjectApiKey({ url, apiKey });
        
        debug('GET', agent?.defaults?.baseURL, url);
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
        var {
            apiKey = driverApiKey, i18n = driverI18N,
            ...otherOptions
        } = options;
        try {
            // NOTE: we could use drover post maybe?
            var { status, data } = await writeRequest({
                agent, url: '/', payload: message, options: {
                    apiKey, i18n, ...otherOptions
                }
            });

            var modified = data.data;
            if (Array.isArray(modified)) {
                for (var it of modified) {
                    cache.setLastChannelId({ ...it });
                    cache.setLastKnownEventId({ ...it });
                }
            }

            return { status, data };
        }
        catch (e) {
            if (e instanceof RequestError) {
                if (e.httpStatusCode === 400) {
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
                    //throw new Error('BadRequest')
                    
                    throw e;
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

    driver.crt = __withDriver(driver, inter.crt);
    driver.helperSet = __withDriver(driver, inter.helperSet);
    driver.researchGroup = __withDriver(driver, inter.researchGroup);
    driver.systemRole = __withDriver(driver, inter.systemRole);
    driver.personnel = __withDriver(driver, inter.personnel);

    driver.study = __withDriver(driver, inter.study);
    driver.subject = __withDriver(driver, inter.subject);

    return driver;
}

var __withDriver = (driver, obj) => {
    var out = {};
    //NOTE: let
    for (let [key, fn] of Object.entries(obj)) {
        out[key] = (bag) => fn({ driver, ...bag })
    }

    return out;
}

Driver.DriverError = DriverError;
Driver.RequestError = RequestError;
Driver.ApiError = ApiError;

module.exports = Driver;
