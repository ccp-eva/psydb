import Axios from 'axios';
import { getSystemTimezone } from '@mpieva/psydb-timezone-helpers';
import { jsonpointer } from '@mpieva/psydb-core-utils';
import { CRTSettings, CRTSettingsList } from '@mpieva/psydb-common-lib';

const createAgent = (options = {}) => {
    var { language, localeCode } = options;

    const axios = Axios.create();

    const dumpPOST = ({ url }) => (bag = {}) => {
        var { extraAxiosConfig, ...payload } = bag;
        return axios.post(
            url,
            payload, extraAxiosConfig,
        );
    }

    //axios.interceptors.response.use(
    //    (response) => (response),
    //    (error) => {
    //        if (error.response && error.response.status === 401) {
    //            window.location = '/';
    //            return Promis.resolve();
    //        }
    //        else {
    //            return Promise.reject(error);
    //        }
    //    }
    //)

    axios.interceptors.request.use(
        (config) => {
            var timezone = getSystemTimezone();
            config.headers.timezone = timezone;
            config.headers.language = language;
            config.headers.locale = localeCode;
            return config;
        },
        (error) => Promise.reject(error)
    );

    var agent = {
        getAxios: () => axios,
    }

    agent.signOut = () => {
        return axios.post('/api/sign-out');
    }

    agent.send = ({ message, extraAxiosConfig }) => {
        return axios.post('/api/', {
            ...message,
            timezone: getSystemTimezone(),
        }, extraAxiosConfig);
    }

    agent.fetchServerTimezone = () => {
        return axios.get(`/api/server-timezone`);
    }

    agent.readCustomRecordTypeMetadata = ({
        only, ignoreResearchGroups
    } = {}) => {
        return axios.post(`/api/metadata/custom-record-types`, {
            only, ignoreResearchGroups
        });
    }

    agent.readRecordSchema = ({
        collection,
        recordType
    }) => {
        var url = (
            recordType
            ? `/api/metadata/record-schema/${collection}/${recordType}`
            : `/api/metadata/record-schema/${collection}`
        );
        return axios.get(url);
    }

    agent.readCRTSettings = ({
        id,
        collection,
        recordType,
        wrap,
        
        extraAxiosConfig,
    }) => {
        var url = undefined;
        if (id && !collection) {
            url = `/api/metadata/crt-settings-by-id/${id}`
        }
        else if (id && collection) {
            url = (
                `/api/metadata/crt-settings-by-record-id/${collection}/${id}`
            )
        }
        else if (recordType) {
            url = `/api/metadata/crt-settings/${collection}/${recordType}`;
        }
        else {
            url = `/api/metadata/crt-settings/${collection}`
        }

        var p = axios.get(url, extraAxiosConfig);
        
        if (wrap) {
            CRTSettings.wrapResponsePromise(p);
        }

        return p;
    }

    agent.fetchCollectionCRTs = ({
        collection,
    }) => {
        var url = `/api/metadata/collection-crts/${collection}`;
        return axios.get(url);
    }

    agent.fetchSubjectStudyCRTs = ({
        subjectType,
    }) => {
        var url = `/api/metadata/subject-study-crts/${subjectType}`;
        return axios.get(url);
    }

    agent.readSubjectForInviteMail = (options) => {
        var { id, extraAxiosConfig } = options;
        return axios.post('/api/subject/read-for-invite-mail', {
            id
        }, extraAxiosConfig);
    }

    agent.readManySubjects = (options) => {
        var { ids, extraAxiosConfig } = options;
        return axios.post('/api/subject/read-many', {
            ids
        }, extraAxiosConfig);
    }

    agent.searchResearchGroupMetadata = (options) => {
        var { extraAxiosConfig, ...pass } = options;
        return axios.post('/api/researchGroup/search-metadata', {
            ...pass
        }, extraAxiosConfig);
    }

    agent.readRecord = ({
        collection,
        recordType,
        id,

        additionalParams,
        extraAxiosConfig,
    }) => {
        //console.log({ collection, recordType });
        var url = (
            recordType
            ? `/api/read/${collection}/${recordType}/${id}`
            : `/api/read/${collection}/${id}`
        );

        //return axios.get(url, additionalParams);
        return axios.get(url, extraAxiosConfig);
    }

    agent.searchRecords = ({
        target,
        collection,
        recordType,
        searchOptions,

        offset,
        limit,
        constraints,
        extraIds,
        excludedIds,
        filters,
        sort,

        showHidden,
    }) => {
        var url = (
            ['apiKey', 'helperSet', 'helperSetItem'].includes(collection)
            ? `/api/${collection}/search`
            : '/api/search'
        )
        return (
            axios.post(url, {
                target,
                collectionName: collection,
                recordType,
                searchOptions,

                offset: offset || 0,
                limit: limit || 50,
                filters: filters || {},
                constraints: constraints || {},
                extraIds,
                excludedIds,
                sort: sort || undefined,
                showHidden,
            })
        )
    }

    agent.searchExport = (bag) => {
        var {
            collection,
            recordType,
            searchOptions,
            constraints = {},
            filters = {},
            sort,
            showHidden,
        } = bag;

        return axios.post('/api/search-export', {
            collection,
            recordType,
            searchOptions,
            constraints,
            filters,
            sort,
            showHidden,

            timezone: getSystemTimezone(),
        });
    }

    agent.fetchSubjectTypeDataForStudy = ({
        studyId,
    }) => {
        var baseUrl = '/api/subject-type-data-for-study';
        return axios.get(`${baseUrl}/${studyId}`);
    }

    agent.fetchAvailableTestLocationsForStudy = ({
        studyId,
        locationRecordTypeId,
    }) => {
        var baseUrl = '/api/available-test-locations-for-study';
        return axios.get(`${baseUrl}/${studyId}/${locationRecordTypeId}`);
    }

    agent.fetchExperimentOperatorTeamsForStudy = ({
        studyId,
    }) => {
        var baseUrl = '/api/experiment-operator-teams-for-study';
        return axios.get(`${baseUrl}/${studyId}`);
    }

    agent.fetchParticipatedSubjectsForStudy = ({
        studyId,
        onlyParticipated,
        sort,
        extraAxiosConfig,
    }) => {
        var baseUrl = '/api/participated-subjects-for-study';
        return axios.post(baseUrl, {
            studyId,
            onlyParticipated,
            sort,
        }, extraAxiosConfig);
    }

    agent.fetchParticipatedStudiesForSubject = ({
        subjectId,
        onlyParticipated,
        sort,
        extraAxiosConfig,
    }) => {
        var baseUrl = '/api/participated-studies-for-subject';
        return axios.post(baseUrl, {
            subjectId, onlyParticipated, sort
        }, extraAxiosConfig);
    }

    agent.fetchStudyLocationReservationCalendar = ({
        studyId,
        locationRecordType,
        start,
        end,
        experimentType,
        selectedSubjectId,
    }) => {
        var baseUrl = '/api/study-location-reservation-calendar';
        return axios.post(baseUrl, {
            experimentType,
            start,
            end,
            studyId,
            locationRecordType,
            selectedSubjectId,
        });
    }

    agent.fetchReservableLocationTimeTable = ({
        locationIds,
        start,
        end,
    }) => {
        var baseUrl = '/api/reservable-location-time-table';
        return axios.post(baseUrl, {
            locationIds,
            start,
            end,
        });
    }

    agent.fetchStudyAwayTeamReservationCalendar = ({
        studyId,
        start,
        end
    }) => {
        var baseUrl = '/api/study-away-team-reservation-calendar';
        return axios.get([
            baseUrl,
            start.toISOString(),
            end.toISOString(),
            studyId,
        ].join('/'));
    }

    agent.fetchTestableSubjectTypesForStudies = ({
        studyIds,
        labProcedureType,
    }) => {
        return axios.post(
            '/api/testable-subject-types-for-studies',
            { studyIds, labProcedureType }
        );
    }

    agent.fetchSelectionSettingsForSubjectTypeAndStudies = ({
        studyIds,
        subjectRecordType
    }) => {
        return axios.post(
            '/api/selection-settings-for-subject-type-and-studies',
            {
                studyIds,
                subjectRecordType
            }
        );
    }

    var searchSubjectsTestable = ({
        labProcedureTypeKey,

        subjectTypeKey,
        studyTypeKey,
        studyIds,

        interval,
        filters,
        quickSearchFilters,

        offset = 0,
        limit = 100,
        output = 'full',
        sampleSize,
    }) => {
        return axios.post(
            `/api/search-subjects-testable/${labProcedureTypeKey}`,
            {
                timezone: getSystemTimezone(),
                subjectTypeKey,
                studyTypeKey,
                studyIds,

                interval,
                filters,
                quickSearchFilters,
                
                offset,
                limit,

                output,
                sampleSize
            }
        );
    }

    agent.searchSubjectsTestableInhouse = (options) => {
        return searchSubjectsTestable({
            labProcedureTypeKey: 'inhouse',
            ...options,
        })
    }

    agent.searchSubjectsTestableViaAwayTeam = (options) => {
        return searchSubjectsTestable({
            labProcedureTypeKey: 'away-team',
            ...options,
        })
    }

    agent.searchSubjectsTestableInOnlineVideoCall = (options) => {
        return searchSubjectsTestable({
            labProcedureTypeKey: 'online-video-call',
            ...options,
        })
    }

    agent.searchSubjectsTestableInOnlineSurvey = (options) => {
        return searchSubjectsTestable({
            labProcedureTypeKey: 'online-survey',
            ...options,
        })
    }


    agent.fetchInviteConfirmationList = ({
        researchGroupId,
        subjectRecordType,
        studyIds,
        start,
        end
    }) => {
        return axios.post(
            '/api/invite-confirmation-list',
            {
                researchGroupId,
                subjectRecordType,
                studyIds,
                start,
                end
            }
        );
    }

    agent.fetchExperimentCalendar = ({
        interval,

        experimentType,
        experimentTypes,
        subjectRecordType,
        studyId,
        researchGroupId,
        locationId,

        experimentOperatorTeamIds,
        showPast,
    }) => {
        return axios.post(
            '/api/experiment-calendar',
            {
                interval,

                experimentTypes: experimentTypes || [ experimentType ],
                subjectRecordType,
                studyId,
                researchGroupId,
                locationId,

                experimentOperatorTeamIds,
                showPast
            }
        );
    }

    agent.fetchLocationExperimentCalendar = ({
        locationType,
        researchGroupId,
        interval,

        experimentType,
        studyId,
    }) => {
        return axios.post(
            '/api/location-experiment-calendar',
            {
                locationType,
                researchGroupId,
                interval,

                experimentType,
                studyId,
            }
        );
    }

    agent.fetchSelectableStudies = ({
        studyRecordType,
        experimentType,
        experimentTypes,
        target,
        filters,
    }) => {
        return axios.post(
            '/api/selectable-studies',
            {
                studyRecordType,
                experimentType,
                experimentTypes,
                target,
                filters,
            }
        );
    }

    agent.fetchSelectableStudiesForCalendar = (bag) => {
        var {
            experimentTypes,
            researchGroupId = undefined
        } = bag;

        return axios.post(
            '/api/selectable-studies-for-calendar',
            {
                experimentTypes,
                researchGroupId,
            }
        );
    }

    agent.fetchExtendedExperimentData = ({
        experimentType,
        experimentId,
    }) => {
        return axios.get(
            `/api/extended-experiment-data/${experimentType}/${experimentId}`,
        );
    }

    agent.fetchExperimentPostprocessing = ({
        experimentType,
        subjectRecordType,
        researchGroupId,
    }) => {
        return axios.post(
            '/api/experiment-postprocessing',
            {
                experimentType,
                subjectRecordType,
                researchGroupId
            }
        );
    }

    agent.fetchExperimentVariants = ({
        studyId,
        studyIds,
        subjectType
    }) => {
        return axios.post(
            '/api/experiment-variants',
            {
                studyIds: studyIds || [ studyId ],
                subjectType,
            }
        );
    }

    agent.fetchExperimentVariantSettings = ({
        type,
        types,
        studyId,
        studyIds,
        subjectType,
        subjectTypes
    }) => {
        return axios.post(
            '/api/experiment-variant-settings',
            {
                studyIds: studyIds || (studyId ? [ studyId ] : undefined),
                types: types || (type ? [ type ] : undefined),
                subjectTypes: (subjectTypes || (subjectType ? [ subjectType ] : undefined))
            }
        );
    }

    agent.fetchSubjectSelectors = ({
        studyId,
        studyIds,
    }) => {
        return axios.post(
            '/api/subject-selectors',
            {
                studyIds: studyIds || [ studyId ],
            }
        );
    }

    agent.fetchAgeFrames = ({
        studyId,
        studyIds,
    }) => {
        return axios.post(
            '/api/age-frames',
            {
                studyIds: studyIds || [ studyId ],
            }
        );
    }

    agent.fetchRecordReverseRefs = ({
        collection,
        id,
        extraAxiosConfig
    }) => {
        return axios.get(
            `/api/record-reverse-refs/${collection}/${id}`,
            extraAxiosConfig
        );
    }

    agent.fetchLocationReverseRefs = ({
        id,
        extraAxiosConfig
    }) => {
        return axios.get(
            `/api/location-reverse-refs/${id}`,
            extraAxiosConfig
        );
    }

    agent.fetchSubjectReverseRefs = ({
        id,
        extraAxiosConfig
    }) => {
        return axios.get(
            `/api/subject-reverse-refs/${id}`,
            extraAxiosConfig
        );
    }

    agent.fetchHelperSetPreRemoveInfo = ({
        id,
        extraAxiosConfig
    }) => {
        return axios.get(
            `/api/helper-set-pre-remove-info/${id}`,
            extraAxiosConfig
        );
    }

    agent.fetchCRTPreRemoveInfo = ({
        id,
        extraAxiosConfig
    }) => {
        return axios.get(
            `/api/custom-record-type/pre-remove-info/${id}`,
            extraAxiosConfig
        );
    }
    
    agent.fetchAvailableCRTs = (bag) => {
        var {
            collections,
            ignoreResearchGroups = false,
            wrap = true,
            extraAxiosConfig,
        } = bag;

        var p = axios.post(
            '/api/custom-record-type/list-available',
            { collections, ignoreResearchGroups },
            extraAxiosConfig,
        );

        if (wrap) {
            CRTSettingsList.wrapResponsePromise(p);
        }

        return p;
    }


    agent.fetchSubjectGroupPreRemoveInfo = ({
        id,
        extraAxiosConfig
    }) => {
        return axios.get(
            `/api/subject-group/pre-remove-info/${id}`,
            extraAxiosConfig
        );
    }

    agent.fetchExperimentVariantPreRemoveInfo = ({
        id,
        extraAxiosConfig
    }) => {
        return axios.get(
            `/api/experiment-variant/pre-remove-info/${id}`,
            extraAxiosConfig
        );
    }

    agent.fetchExperimentVariantSettingPreRemoveInfo = ({
        id,
        extraAxiosConfig
    }) => {
        return axios.get(
            `/api/experiment-variant-setting/pre-remove-info/${id}`,
            extraAxiosConfig
        );
    }

    agent.fetchOpsTeamExperiments = (bag) => {
        var {
            teamId,
            out = 'full',
            extraAxiosConfig,
        } = bag;

        return axios.post(
            '/api/ops-team/related-experiments',
            { teamId, out },
            extraAxiosConfig,
        );
    }

    agent.fetchSubjectExperiments = (bag) => {
        var {
            subjectId,
            studyId,
            out = 'full',
            extraAxiosConfig,
        } = bag;

        return axios.post(
            '/api/subject/related-experiments',
            { subjectId, studyId, out },
            extraAxiosConfig,
        );
    }

    agent.fetchLocationExperiments = (bag) => {
        var {
            locationId,
            includePastExperiments,
            out = 'full',
            extraAxiosConfig,
        } = bag;

        return axios.post(
            '/api/location/related-experiments',
            { locationId, includePastExperiments, out },
            extraAxiosConfig,
        );
    }

    agent.fetchPersonnelParticipation = (bag) => {
        var {
            personnelId,
            extraAxiosConfig,
        } = bag;

        return axios.post(
            '/api/personnel/related-participation',
            {
                personnelId,
                timezone: getSystemTimezone(),
            },
            extraAxiosConfig,
        );
    }

    agent.fetchSubjectPossibleTestIntervals = (bag) => {
        var {
            subjectIds, studyId,
            labProcedureTypeKey, desiredTestInterval,
            extraAxiosConfig,
        } = bag;

        return axios.post(
            '/api/subject/possible-test-intervals',
            { 
                subjectIds, studyId,
                labProcedureTypeKey, desiredTestInterval
            },
            extraAxiosConfig,
        );
    }

    agent.fetchChannelHistory = ({
        channelId, 
    }) => {
        var url = `/api/channel-history/${channelId}`;
        return axios.get(url);
    }

    agent.uploadFiles = (bag) => {
        var {
            files,
            extraAxiosConfig,
        } = bag;

        var formData = new FormData();
        for (var [ ix, it ] of files.entries()) {
            formData.append(`file_${ix}`, it);
        }

        return axios.post(
            '/api/file/upload',
            formData,
            extraAxiosConfig,
        );
    }

    agent.fetchCSVImportPreview = (bag) => {
        var {
            fileId,
            studyId,
            extraAxiosConfig,
        } = bag;

        return axios.post(
            '/api/csv-import/preview',
            { 
                fileId, studyId,
                timezone: getSystemTimezone(),
            },
            extraAxiosConfig,
        );
    }

    agent.searchCSVExperimentImports = dumpPOST({
        url: '/api/csv-import/experiment/search',
    });
    agent.readCSVExperimentImport = dumpPOST({
        url: '/api/csv-import/experiment/read',
    });
    agent.previewCSVExperimentImport = ({ importType, ...pass }) => dumpPOST({
        url: `/api/csv-import/experiment/preview/${importType}`,
    })(pass);
    agent.fetchCSVExperimentImportExperiments = (
        ({ out = 'full', ...pass }) => dumpPOST({
            url: '/api/csv-import/experiment/related-experiments',
        })({ out, ...pass })
    );

    agent.searchCSVSubjectImports = dumpPOST({
        url: '/api/csv-import/subject/search',
    });
    agent.readCSVSubjectImport = dumpPOST({
        url: '/api/csv-import/subject/read',
    });
    agent.previewCSVSubjectImport = dumpPOST({
        url: '/api/csv-import/subject/preview',
    });
    agent.fetchCSVSubjectImportSubjects = (
        ({ out = 'full', ...pass }) => dumpPOST({
            url: '/api/csv-import/subject/related-subjects',
        })({ out, ...pass })
    );

    agent.fetchStudySubjectTypeInfos = (bag) => {
        var {
            studyId,
            extraAxiosConfig,
        } = bag;

        return axios.post(
            '/api/study/subject-type-infos',
            { studyId },
            extraAxiosConfig,
        );
    }
    
    agent.fetchStudyAvailableSubjectCRTs = (bag) => {
        var {
            studyId,
            wrap = true,
            extraAxiosConfig,
        } = bag;

        var p =  axios.post(
            '/api/study/available-subject-crts',
            { studyId },
            extraAxiosConfig,
        );

        if (wrap) {
            CRTSettingsList.wrapResponsePromise(p);
        }
        return p;
    }

    agent.fetchStudyEnabledSubjectCRTs = (bag) => {
        var {
            studyId,
            wrap = true,
            extraAxiosConfig,
        } = bag;

        var p =  axios.post(
            '/api/study/enabled-subject-crts',
            { studyId },
            extraAxiosConfig,
        );

        if (wrap) {
            CRTSettingsList.wrapResponsePromise(p);
        }
        return p;
    }

    agent.fetchStudyEnabledCSVImporters = (bag) => {
        var { studyId, subjectType, importType, extraAxiosConfig } = bag;

        return axios.post(
            '/api/study/enabled-csv-importers',
            { studyId, subjectType, importType },
            extraAxiosConfig,
        );
    }

    agent.fetchOneRecord = (bag) => {
        var { extraAxiosConfig, collection, ...payload } = bag;
        return axios.post(
            `/api/${collection}/read`,
            payload, extraAxiosConfig,
        );
    }

    agent.fetchSpooledRecord = (bag) => {
        var { extraAxiosConfig, collection, ...payload } = bag;
        return axios.post(
            `/api/${collection}/read-spooled`,
            payload, extraAxiosConfig,
        );
    }

    // FIXME: use es6-template-strings to build url
    agent.fetchManyRecords = ({ collection, ...pass }) => (
        dumpPOST({ url: `/api/${collection}/read-many` })(pass)
    );

    agent.fetchMQMessageHistoryList = dumpPOST({
        url: '/api/audit/mq-message-history/list'
    });
    agent.fetchMQMessageHistoryRecord = dumpPOST({
        url: '/api/audit/mq-message-history/read'
    });
    agent.fetchRohrpostEventList = dumpPOST({
        url: '/api/audit/rohrpost-event/list'
    });
    agent.fetchRohrpostEventRecord = dumpPOST({
        url: '/api/audit/rohrpost-event/read'
    });

    ///////////////////////

    agent.fetch = (tag, payload) => {
        var fn = jsonpointer.get(agent, tag);
        return fn(payload);
    }
    agent.subject = {
        listDuplicates: dumpPOST({ url: '/api/subject/listDuplicates' }),
        extendedSearch: dumpPOST({ url: '/api/extended-search/subjects' }),
    };
    agent.study = {
        list: dumpPOST({ url: '/api/study/list' }),
        extendedSearch: dumpPOST({ url: '/api/extended-search/studies' }),
    };
    agent.helperSet = {
        list: dumpPOST({ url: '/api/helperSet/list' }),
    };
    agent.helperSetItem = {
        list: dumpPOST({ url: '/api/helperSetItem/list' }),
    };
    
    // XXX
    agent.fetchFixedEventDetails = (bag) => {
        var { extraAxiosConfig, ...payload } = bag;
        return axios.post(
            '/api/fixed-event-details',
            payload, extraAxiosConfig,
        );
    }
    // XXX
    agent.fetchFixedAddEventList = (bag) => {
        var { extraAxiosConfig, ...payload } = bag;
        return axios.post(
            '/api/fixed-add-event-list',
            payload, extraAxiosConfig,
        );
    }
    // XXX
    agent.fetchFixedImportEventList = (bag) => {
        var { extraAxiosConfig, ...payload } = bag;
        return axios.post(
            '/api/fixed-import-event-list',
            payload, extraAxiosConfig,
        );
    }
    // XXX
    agent.fetchFixedPatchEventList = (bag) => {
        var { extraAxiosConfig, ...payload } = bag;
        return axios.post(
            '/api/fixed-patch-event-list',
            payload, extraAxiosConfig,
        );
    }
    return agent;
}

export default createAgent;
