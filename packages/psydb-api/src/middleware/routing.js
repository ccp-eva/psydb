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

var withPostStages = ({
    protection,
    endpoint
}) => ([
    withSelfAuth(),
    withPermissions(),
    withEndpointProtection({ endpoint: protection }),
    withKoaBody(),
    endpoint
]);

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

    router.get('/server-timezone',
        withSelfAuth(),
        endpoints.special.serverTimezone
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

    router.get('/participated-studies-for-subject/:subjectId',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'participated-studies-for-subject' }),
        endpoints.special.participatedStudiesForSubject
    );

    router.post(
        '/study-location-reservation-calendar',
        ...withPostStages({
            protection: 'study-location-reservation-calendar',
            endpoint: endpoints.special.studyLocationReservationCalendar
        })
    )

    router.get(
        inline`
            /study-away-team-reservation-calendar
            /:start
            /:end
            /:studyId
        `,
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: (
            'study-away-team-reservation-calendar'
        )}),
        endpoints.special.studyAwayTeamReservationCalendar
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

    router.post(
        '/search-subjects-testable/inhouse',
        ...withPostStages({
            protection: 'search-subjects-testable-inhouse',
            endpoint: endpoints.special.searchSubjectsTestableInhouse
        })
    );

    router.post(
        '/search-subjects-testable/away-team',
        ...withPostStages({
            protection: 'search-subjects-testable-via-away-team',
            endpoint: endpoints.special.searchSubjectsTestableViaAwayTeam
        })
    );

    router.post(
        '/search-subjects-testable/online-video-call',
        ...withPostStages({
            protection: 'search-subjects-testable-in-online-video-call',
            endpoint: endpoints.special.searchSubjectsTestableInOnlineVideoCall
        })
    );

    router.post(
        '/search-subjects-testable/online-survey',
        ...withPostStages({
            protection: 'search-subjects-testable-in-online-survey',
            endpoint: endpoints.special.searchSubjectsTestableInOnlineSurvey
        })
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
        withEndpointProtection({ endpoint: 'experiment-calendar' }),
        withKoaBody(),
        endpoints.special.experimentCalendar
    );

    router.post('/location-experiment-calendar',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'location-experiment-calendar' }),
        withKoaBody(),
        endpoints.special.locationExperimentCalendar
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

    router.get('/extended-experiment-data/:experimentType/:experimentId',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'extended-experiment-data' }),
        endpoints.special.extendedExperimentData
    );

    router.post('/experiment-postprocessing',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'experiment-postprocessing' }),
        withKoaBody(),
        endpoints.special.experimentPostprocessing
    );

    router.post('/experiment-variants',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'experiment-variants' }),
        withKoaBody(),
        endpoints.special.experimentVariants
    );

    router.post('/experiment-variant-settings',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'experiment-variant-settings' }),
        withKoaBody(),
        endpoints.special.experimentVariantSettings
    );

    router.post('/subject-selectors',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'subject-selectors' }),
        withKoaBody(),
        endpoints.special.subjectSelectors
    );

    router.post('/age-frames',
        withSelfAuth(),
        withPermissions(),
        withEndpointProtection({ endpoint: 'age-frames' }),
        withKoaBody(),
        endpoints.special.ageFrames
    );

    return compose([
        router.routes(),
        router.allowedMethods(),
    ]);
    
}

module.exports = createRouting;
