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

    /*router.get('/available-test-locations-for-study/:studyId/:locationRecordTypeId',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'available-test-locations-for-study' }),
        endpoints.special.availableTestLocationsForStudy
    );*/

    router.get('/experiment-operator-teams-for-study/:studyId',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'experiment-operator-teams-for-study' }),
        endpoints.special.experimentOperatorTeamsForStudy
    );

    router.get('/participated-subjects-for-study/:studyId',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'participated-subjects-for-study' }),
        endpoints.special.participatedSubjectsForStudy
    );

    router.get(
        inline`
            /study-location-reservation-calendar
            /:start
            /:end
            /:studyId
            /:locationRecordType
        `,
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: (
            'study-location-reservation-calendar'
        )}),
        endpoints.special.studyLocationReservationCalendar
    );

    router.post('/testable-subject-types-for-studies',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({
            endpoint: 'testable-subject-types-for-studies'
        }),
        withKoaBody(),
        endpoints.special.testableSubjectTypesForStudies
    );

    router.post('/selection-settings-for-subject-type-and-studies',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({
            endpoint: 'selection-settings-for-subject-type-and-studies'
        }),
        withKoaBody(),
        endpoints.special.selectionSettingsForSubjectTypeAndStudies
    );

    router.post('/testable-subjects-inhouse',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'testable-subjects-inhouse' }),
        withKoaBody(),
        endpoints.special.testableSubjectsInhouse
    );

    router.post('/invite-confirmation-list',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'invite-confirmation-list' }),
        withKoaBody(),
        endpoints.special.inviteConfirmationList
    );

    router.post('/experiment-calendar',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'iexperiment-calendar' }),
        withKoaBody(),
        endpoints.special.experimentCalendar
    );

    router.post('/selectable-studies',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'selectable-studies' }),
        withKoaBody(),
        endpoints.special.selectableStudies
    );

    router.post('/selectable-studies-for-calendar',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'selectable-studies-for-calendar' }),
        withKoaBody(),
        endpoints.special.selectableStudiesForCalendar
    );

    router.get('/subject-type-data-for-study/:studyId',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'subject-type-data-for-study' }),
        endpoints.special.subjectTypeDataForStudy
    );

    return compose([
        router.routes(),
        router.allowedMethods(),
    ]);
    
}

module.exports = createRouting;
