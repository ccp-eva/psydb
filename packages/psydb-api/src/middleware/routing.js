'use strict';
var compose = require('koa-compose'),
    KoaRouter = require('koa-router'),
    withKoaBody = require('koa-body'),
    withMongoBody = require('@mpieva/koa-mongo-extjson-body'),

    withSelfAuth = require('./self-auth'),
    withPermissions = require('./permissions'),
    withEndpointProtection = require('./endpoint-protection'),
    
    init = require('../init-endpoint'),
    endpoints = require('../endpoints/');

var createRouting = ({
    prefix = '/',
} = {}) => {
    var router = KoaRouter({
        prefix: prefix.replace(/\/$/, ''),
    });

    router.post('/sign-in', withKoaBody(), endpoints.publicSignIn);
    router.post('/sign-out', endpoints.publicSignOut);

    router.post('/init',
        init
    );

    router.post('/',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'event' }),
        withKoaBody(),
        endpoints.event()
    );

    router.get('/self',
        withSelfAuth(),
        withPermissions(),
        endpoints.self
    );

    router.get('/read/:collectionName/:id',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'read' }),
        endpoints.read
    );

    router.post('/search-in-field',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'search-in-field' }),
        withKoaBody(),
        endpoints.searchInField
    );

    router.post('/search',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'search' }),
        withKoaBody(),
        endpoints.search
    );

    /*router.post('/search/:collectionName(^(_helper_)?[A-Za-z]+$)',
        withProtection(),
        withMongoBody({
            //mimeType: 'application/mongodb-extjson',
            ejsonMimeType: 'application/json',
            ejsonOptions: { relaxed: true },
        }),
        protected.search,
    );*/

    //router.get('/read/:collectionName(...)/:recordId(...)');
    //router.post('/search-for-study')
    //router.post(/event)
    
    return compose([
        router.routes(),
        router.allowedMethods(),
    ]);
}

module.exports = createRouting;
