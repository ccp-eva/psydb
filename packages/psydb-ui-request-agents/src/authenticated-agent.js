import Axios from 'axios';

const axios = Axios.create();

axios.interceptors.response.use(
    (response) => (response),
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location = '/';
            return Promis.resolve();
        }
        else {
            return Promise.reject(error);
        }
    }
)

var agent = {
    getAxios: () => axios,
}

agent.signOut = () => {
    return axios.post('/api/sign-out');
}

agent.send = ({ message }) => {
    return axios.post('/api/', message);
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

agent.readRecord = ({
    collection,
    recordType,
    id,

    additionalParams,
}) => {

    var url = (
        recordType
        ? `/api/read/${collection}/${recordType}/${id}`
        : `/api/read/${collection}/${id}`
    );

    return axios.get(url, additionalParams);
}

agent.searchRecords = ({
    target,
    collection,
    recordType,
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
}) => {
    var baseUrl = '/api/participated-studies-for-subject';
    return axios.get(`${baseUrl}/${subjectId}`);
}

agent.fetchStudyLocationReservationCalendar = ({
    studyId,
    locationRecordType,
    start,
    end
}) => {
    var baseUrl = '/api/study-location-reservation-calendar';
    return axios.get([
        baseUrl,
        start.toISOString(),
        end.toISOString(),
        studyId,
        locationRecordType
    ].join('/'));
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

agent.searchSubjectsTestableViaAwayTeam = ({
    studyRecordType,
    subjectRecordType,
    studyIds,
    timeFrameStart,
    timeFrameEnd,
    enabledAgeFrames,
    enabledValues,
    offset = 0,
    limit = 100,
}) => {
    return axios.post(
        '/api/search-subjects-testable-via-away-team',
        {
            studyRecordType,
            subjectRecordType,
            studyIds,
            timeFrameStart,
            timeFrameEnd,
            enabledAgeFrames,
            enabledValues,
            offset,
            limit,
        }
    );
}

agent.searchSubjectsTestableOnline = ({
    studyRecordType,
    subjectRecordType,
    studyIds,
    timeFrameStart,
    timeFrameEnd,
    enabledAgeFrames,
    enabledValues,
    offset = 0,
    limit = 100,
}) => {
    return axios.post(
        '/api/search-subjects-testable-online',
        {
            studyRecordType,
            subjectRecordType,
            studyIds,
            timeFrameStart,
            timeFrameEnd,
            enabledAgeFrames,
            enabledValues,
            offset,
            limit,
        }
    );
}

agent.searchTestableSubjectsInhouse = ({
    studyRecordType,
    subjectRecordType,
    studyIds,
    timeFrameStart,
    timeFrameEnd,
    enabledAgeFrames,
    enabledValues,
    offset = 0,
    limit = 100,
}) => {
    return axios.post(
        '/api/testable-subjects-inhouse',
        {
            studyRecordType,
            subjectRecordType,
            studyIds,
            timeFrameStart,
            timeFrameEnd,
            enabledAgeFrames,
            enabledValues,
            offset,
            limit,
        }
    );
}

agent.fetchInviteConfirmationList = ({
    subjectRecordType,
    studyIds,
    start,
    end
}) => {
    return axios.post(
        '/api/invite-confirmation-list',
        {
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
}) => {
    return axios.post(
        '/api/selectable-studies',
        {
            studyRecordType,
            experimentType,
            experimentTypes,
            target,
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
}) => {
    return axios.post(
        '/api/experiment-variants',
        {
            studyIds: studyIds || [ studyId ],
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
export default agent;
