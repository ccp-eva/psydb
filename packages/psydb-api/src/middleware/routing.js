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

var inline = require('@cdxoo/inline-string');

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

    // FIXME: split this? any better options?
    // FIXME: nesting routers breaks consistency with our index
    router.use('/metadata',
        //withSelfAuth(),
        ...endpoints.metadata({ middleware: [
            withSelfAuth(),
        ]})
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

    router.get('/read/:collectionName/:recordType/:id',
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

    router.get('/available-test-locations-for-study/:studyId/:locationRecordTypeId',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'available-test-locations-for-study' }),
        endpoints.special.availableTestLocationsForStudy
    );

    router.get('/experiment-operator-teams-for-study/:studyId',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'experiment-operator-teams-for-study' }),
        endpoints.special.experimentOperatorTeamsForStudy
    );

    router.get(
        inline`
            /study-location-reservation-calendar
            /:start
            /:end
            /:studyId
            /:locationRecordTypeId
        `,
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: (
            'study-location-reservation-calendar'
        )}),
        endpoints.special.studyLocationReservationCalendar
    );

    return compose([
        router.routes(),
        router.allowedMethods(),
    ]);
}

module.exports = createRouting;
