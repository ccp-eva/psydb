import Axios from 'axios';

const axios = Axios.create();

axios.interceptors.response.use(
    (response) => (response),
    (error) => {
        if (error.response.status === 401) {
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

agent.readCustomRecordTypeMetadata = () => {
    return axios.get(`/api/metadata/custom-record-types`);
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
    collection,
    recordType,
    offset,
    limit,
    filters,
}) => {
    return (
        axios.post('/api/search', {
            collectionName: collection,
            recordType,
            offset: offset || 0,
            limit: limit || 50,
            filters: filters || {}
        })
    )
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

agent.fetchTestableSubjectTypesForStudies = ({
    studyIds,
}) => {
    return axios.post(
        '/api/testable-subject-types-for-studies',
        { studyIds }
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

agent.searchTestableSubjectsInhouse = ({
    studyRecordType,
    subjectRecordType,
    studyIds,
    timeFrameStart,
    timeFrameEnd,
    enabledAgeFrames,
    enabledvalues,
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
            enabledvalues,
            offset,
            limit,
        }
    );
}

export default agent;
