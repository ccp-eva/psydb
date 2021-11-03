import React, { useEffect, useReducer, useCallback } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import GeneralInfo from '../general-info';
import GeneralFunctions from './general-functions';
import Subjects from './subjects';

const ExperimentDetails = ({
    path,
    url,
    experimentType,
    id,

    experimentData,
    opsTeamData,
    locationData,
    studyData,
    subjectDataByType,

    onSuccessfulUpdate,
}) => {
    return (
        <div>
            <div className='border bg-light p-3'>
                { experimentData.record.state.isCanceled && (
                    <h5 className='text-danger'>
                        Abgesagt
                    </h5>
                )}
                <GeneralInfo { ...({
                    experimentData,
                    opsTeamData,
                    locationData,
                    studyData,
                }) } />
                { !experimentData.record.state.isCanceled && (
                    <>
                        <hr />
                        <div className='mt-3 d-flex justify-content-end'>
                            <GeneralFunctions { ...({
                                experimentData,
                                opsTeamData,
                                studyData,
                                onSuccessfulUpdate,
                            }) } />
                        </div>
                    </>
                )}
            </div>
            <div>
                <Subjects { ...({
                    experimentData,
                    studyData,
                    subjectDataByType,
                    onSuccessfulUpdate,
                }) } />
            </div>
        </div>
    );
}

export default ExperimentDetails;
