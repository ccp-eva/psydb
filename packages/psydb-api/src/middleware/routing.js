'use strict';
var compose = require('koa-compose'),
    KoaRouter = require('koa-router'),
    withKoaBody = require('koa-body'),

    withSelfAuth = require('./self-auth'),
    withPermissions = require('./permissions'),
    
    init = require('../init-endpoint'),
    endpoints = require('../endpoints/');

var inline = require('@cdxoo/inline-string');

var withPostStages = ({
    protection,
    endpoint,
    enableApiKeyAuth
}) => ([
    withSelfAuth({ enableApiKeyAuth }),
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

    router.post('/two-factor-code/match',
        withKoaBody(), endpoints.twoFactorCode.match
    );
    router.post('/two-factor-code/resend',
        withKoaBody(), endpoints.twoFactorCode.resend
    );

    router.get('/init',
        init
    );

    // /api/foo/?apiKey=asdasdads
    router.post('/',
        withSelfAuth({
            enableApiKeyAuth: true
        }),
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
            withPermissions(),
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

    router.post('/helperSet/search', ...withPostStages({
        endpoint: endpoints.helperSet.search,
        enableApiKeyAuth: true,
    }));
    router.post('/helperSetItem/search', ...withPostStages({
        endpoint: endpoints.helperSetItem.search,
        enableApiKeyAuth: true,
    }));
    
    //router.post('/search/helperSetItem',
    //    withSelfAuth(),
    //    withPermissions(),
    //    withKoaBody(),
    //    endpoints.helperSetItem.search
    //);
    
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

    router.post(
        '/participated-subjects-for-study',
        ...withPostStages({
            endpoint: endpoints.special.participatedSubjectsForStudy
        })
    );

    router.post(
        '/participated-studies-for-subject',
        ...withPostStages({
            endpoint: endpoints.special.participatedStudiesForSubject
        })
    );

    router.post(
        '/study-location-reservation-calendar',
        ...withPostStages({
            endpoint: endpoints.special.studyLocationReservationCalendar
        })
    )

    router.post(
        '/reservable-location-time-table',
        ...withPostStages({
            endpoint: endpoints.special.reservableLocationTimeTable
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
    router.post('/extended-search/locations',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.extendedSearch.locations
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
    
    router.get('/subject-reverse-refs/:id',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.subjectReverseRefs
    );
    
    router.get('/location-reverse-refs/:id',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.locationReverseRefs
    );
    
    router.get('/helper-set-pre-remove-info/:id',
        withSelfAuth(),
        withPermissions(),
        endpoints.special.helperSetPreRemoveInfo
    );

    router.get('/record-reverse-refs/:collection/:id',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.special.reverseRefs
    );

    router.get('/custom-record-type/pre-remove-info/:id',
        withSelfAuth(),
        withPermissions(),
        endpoints.customRecordType.preRemoveInfo
    );
    
    router.get('/experiment-variant/pre-remove-info/:id',
        withSelfAuth(),
        withPermissions(),
        endpoints.experimentVariant.preRemoveInfo
    );
    
    router.get('/experiment-variant-setting/pre-remove-info/:id',
        withSelfAuth(),
        withPermissions(),
        endpoints.experimentVariantSetting.preRemoveInfo
    );


    router.post('/personnel/related-participation',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.personnel.relatedParticipation
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

    router.post('/subject/read-many',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.subject.readMany
    );
    
    router.post('/subject/read-for-invite-mail', ...withPostStages({
        endpoint: endpoints.subject.readForInviteMail
    }));


    // FIXME
    //router.post('/api-key/search', ...withPostStages({
    //    endpoint: endpoints.subjectGroup.search
    //}));
    router.get('/subject-group/pre-remove-info/:id',
        withSelfAuth(),
        withPermissions(),
        endpoints.subjectGroup.preRemoveInfo
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

    router.post('/apiKey/search', ...withPostStages({
        endpoint: endpoints.apiKey.search
    }));

    router.get('/channel-history/:channelId',
        withSelfAuth(),
        withPermissions(),
        endpoints.channelHistory
    );

    router.post('/file/upload',
        withSelfAuth(),
        withPermissions(),
        endpoints.file.upload
    );
    
    router.post('/csv-import/preview',
        withSelfAuth(),
        withPermissions(),
        withKoaBody(),
        endpoints.csvImport.preview
    );

    router.post('/researchGroup/search-metadata', ...withPostStages({
        endpoint: endpoints.researchGroup.searchMetadata
    }));

    router.post('/study/read-many', ...withPostStages({
        endpoint: endpoints.study.readMany
    }));
    router.post('/study/subject-type-infos', ...withPostStages({
        endpoint: endpoints.study.subjectTypeInfos
    }));
    
    router.post('/experiment/read', ...withPostStages({
        endpoint: endpoints.experiment.read
    }));
    router.post('/experiment/read-spooled', ...withPostStages({
        endpoint: endpoints.experiment.readSpooled
    }));

    router.post('/subject/read', ...withPostStages({
        endpoint: endpoints.subject.read
    }));
    router.post('/subject/read-spooled', ...withPostStages({
        endpoint: endpoints.subject.readSpooled
    }));

    router.post('/audit/mq-message-history/list', ...withPostStages({
        endpoint: endpoints.audit.mqMessageHistory.list
    }));
    router.post('/audit/mq-message-history/read', ...withPostStages({
        endpoint: endpoints.audit.mqMessageHistory.read
    }));
    router.post('/audit/rohrpost-event/list', ...withPostStages({
        endpoint: endpoints.audit.rohrpostEvent.list
    }));
    router.post('/audit/rohrpost-event/read', ...withPostStages({
        endpoint: endpoints.audit.rohrpostEvent.read
    }));

    // XXX
    router.post('/fixed-event-details', ...withPostStages({
        endpoint: endpoints.temp_fixesChecker.fixedEventDetails
    }));
    router.post('/fixed-add-event-list', ...withPostStages({
        endpoint: endpoints.temp_fixesChecker.fixedAddEventList
    }));
    router.post('/fixed-import-event-list', ...withPostStages({
        endpoint: endpoints.temp_fixesChecker.fixedImportEventList
    }));
    router.post('/fixed-patch-event-list', ...withPostStages({
        endpoint: endpoints.temp_fixesChecker.fixedPatchEventList
    }));

    return compose([
        router.routes(),
        router.allowedMethods(),
    ]);
    
}

module.exports = createRouting;
