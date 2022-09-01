'use strict';
var compose = require('koa-compose'),
    KoaRouter = require('koa-router'),
    withKoaBody = require('koa-body'),
    withMongoBody = require('@mpieva/koa-mongo-extjson-body'),

    withSelfAuth = require('./self-auth'),
    withPermissions = require('./permissions'),
    
    init = require('../init-endpoint'),
    endpoints = require('../endpoints/');

var inline = require('@cdxoo/inline-string');

var withPostStages = ({
    protection,
    endpoint
}) => ([
    withSelfAuth(),
    withPermissions(),
    withKoaBody(),
    endpoint
]);

var createRouting = (bag = {}) => {
    var { prefix = '/' } = bag;

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
        endpoints.self.account
    );

    router.get('/self/research-groups',
        withSelfAuth(),
        withPermissions(),
        endpoints.self.researchGroups
    )

    router.get('/self/available-research-groups',
        withSelfAuth(),
        withPermissions(),
        endpoints.self.availableResearchGroups
    )


    router.get('/read/:collectionName/:id',
        withSelfAuth(),
        withPermissions(),
        endpoints.read
    );

    router.get('/read/:collectionName/:recordType/:id',
        withSelfAuth(),
        withPermissions(),
        endpoints.read
    );

    router.post('/search-in-field',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.searchInField
    );

    router.post('/search',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.search
    );
    
    router.post('/search-export',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.searchExport
    );

    /*router.get('/available-test-locations-for-study/:studyId/:locationRecordTypeId',
        withSelfAuth(),
        withPermissions(),
        endpoints.special.availableTestLocationsForStudy
    );*/

    router.get('/experiment-operator-teams-for-study/:studyId',
        withSelfAuth(),
        withPermissions(),
        endpoints.special.experimentOperatorTeamsForStudy
    );

    router.get('/participated-subjects-for-study/:studyId',
        withSelfAuth(),
        withPermissions(),
        endpoints.special.participatedSubjectsForStudy
    );

    router.get('/participated-studies-for-subject/:subjectId',
        withSelfAuth(),
        withPermissions(),
        endpoints.special.participatedStudiesForSubject
    );

    router.post(
        '/study-location-reservation-calendar',
        ...withPostStages({
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
        endpoints.special.studyAwayTeamReservationCalendar
    );

    router.post('/testable-subject-types-for-studies',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.testableSubjectTypesForStudies
    );

    router.post('/selection-settings-for-subject-type-and-studies',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.selectionSettingsForSubjectTypeAndStudies
    );

    router.post(
        '/search-subjects-testable/inhouse',
        ...withPostStages({
            endpoint: endpoints.special.searchSubjectsTestableInhouse
        })
    );

    router.post(
        '/search-subjects-testable/away-team',
        ...withPostStages({
            endpoint: endpoints.special.searchSubjectsTestableViaAwayTeam
        })
    );

    router.post(
        '/search-subjects-testable/online-video-call',
        ...withPostStages({
            endpoint: endpoints.special.searchSubjectsTestableInOnlineVideoCall
        })
    );

    router.post(
        '/search-subjects-testable/online-survey',
        ...withPostStages({
            endpoint: endpoints.special.searchSubjectsTestableInOnlineSurvey
        })
    );

    router.post(
        '/search-studies-testable-for-subject',
        ...withPostStages({
            endpoint: endpoints.special.searchStudiesTestableForSubject
        })
    );

    router.post('/invite-confirmation-list',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.inviteConfirmationList
    );

    router.post('/reception-calendar',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.receptionCalendar
    );

    router.post('/experiment-calendar',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.experimentCalendar
    );

    router.post('/location-experiment-calendar',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.locationExperimentCalendar
    );

    router.post('/selectable-studies',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.selectableStudies
    );

    router.post('/selectable-studies-for-calendar',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.selectableStudiesForCalendar
    );

    router.get('/subject-type-data-for-study/:studyId',
        withSelfAuth(),
        withPermissions(),
        endpoints.special.subjectTypeDataForStudy
    );

    router.get('/extended-experiment-data/:experimentType/:experimentId',
        withSelfAuth(),
        withPermissions(),
        endpoints.special.extendedExperimentData
    );

    router.post('/experiment-postprocessing',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.experimentPostprocessing
    );

    router.post('/experiment-variants',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.experimentVariants
    );

    router.post('/experiment-variant-settings',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.experimentVariantSettings
    );

    router.post('/subject-selectors',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.subjectSelectors
    );

    router.post('/age-frames',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.ageFrames
    );

    router.post('/study-topic-tree',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.studyTopicTree
    );

    router.post('/search-studies-for-exclusion',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.searchStudiesForExclusion
    );

    router.post('/extended-search/subjects',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.extendedSearch.subjects
    );
    router.post('/extended-search/studies',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.extendedSearch.studies
    );

    router.post('/extended-search-export/subject',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.extendedSearchExport.subject
    );

    router.post('/extended-search-export/study',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.extendedSearchExport.study
    );

    router.get('/reverse-refs/:collection',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.reverseRefs
    );

    router.get('/record-reverse-refs/:collection/:id',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.reverseRefs
    );

    router.post('/ops-team/related-experiments',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.opsTeam.relatedExperiments
    );

    router.post('/subject/related-experiments',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.subject.relatedExperiments
    );

    router.post('/location/related-experiments',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.location.relatedExperiments
    );

    router.post('/subject/possible-test-intervals',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.readSubjectTestability
    );

    return compose([
        router.routes(),
        router.allowedMethods(),
    ]);
    
}

module.exports = createRouting;
