'use strict';
var compose = require('koa-compose'),
    KoaRouter = require('koa-router'),
    withKoaBody = require('koa-body'),
    withMongoBody = require('@mpieva/koa-mongodb-extjson-body'),

    withPermissions = require('./permissions'),
    withEndpointProtection = require('./endpoint-protection'),

    public = require('../public-endpoints'),
    protected = require('../protected-endpoints/');

var createRouting = ({
    prefix = '/',
}) => {
    var router = KoaRouter({
        prefix,
    });

    router.post('/sign-in', withKoaBody(), public.signIn);
    router.post('/sign-out', public.signOut);

    router.post('/',
        withPermissions(),
        withEndpointProtection({ endpoint: 'event' }),
        withKoaBody(),
        protected.event
    );

    /*router.get('/self',
        withProtection(),
        protected.self
    );*/

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
