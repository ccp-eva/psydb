import Axios from 'axios';
import { getSystemTimezone } from '@mpieva/psydb-timezone-helpers';

const axios = Axios.create();

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
    only,
} = {}) => {
    return axios.post(`/api/metadata/custom-record-types`, { only });
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
    collection,
    recordType
}) => {
    var url = (
        recordType
        ? `/api/metadata/crt-settings/${collection}/${recordType}`
        : `/api/metadata/crt-settings/${collection}`
    );
    return axios.get(url);
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

agent.readRecord = ({
    collection,
    recordType,
    id,

    additionalParams,
    extraAxiosConfig,
}) => {

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
    filters,
    sort,
}) => {
    return (
        axios.post('/api/search', {
            target,
            collectionName: collection,
            recordType,
            searchOptions,

            offset: offset || 0,
            limit: limit || 50,
            filters: filters || {},
            constraints: constraints || {},
            sort: sort || undefined
        })
    )
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
}) => {
    var baseUrl = '/api/participated-subjects-for-study';
    return axios.get(`${baseUrl}/${studyId}`);
}

agent.fetchParticipatedStudiesForSubject = ({
    subjectId,
    extraAxiosConfig,
}) => {
    var baseUrl = '/api/participated-studies-for-subject';
    return axios.get(`${baseUrl}/${subjectId}`, extraAxiosConfig);
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

    offset = 0,
    limit = 100,
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
            
            offset,
            limit,
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
    subjectRecordType,
    interval,
    experimentType,
    studyId,
    researchGroupId,
}) => {
    return axios.post(
        '/api/experiment-calendar',
        {
            subjectRecordType,
            studyId,
            interval,
            experimentType,
            researchGroupId,
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

agent.fetchSelectableStudiesForCalendar = ({
    subjectRecordType,
    experimentType,
    researchGroupId,
}) => {
    return axios.post(
        '/api/selectable-studies-for-calendar',
        {
            subjectRecordType,
            experimentType,
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
    studyId,
    studyIds,
}) => {
    return axios.post(
        '/api/experiment-variant-settings',
        {
            studyIds: studyIds || [ studyId ],
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

export default agent;
