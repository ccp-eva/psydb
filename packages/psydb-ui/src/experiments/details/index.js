import React, { useEffect, useReducer, useCallback } from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

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

import {
    SubjectLabelOnlyContainer,
} from '../shared-general-functions';

const ExperimentDetails = ({
    path,
    url,
    experimentType,
    id,

    experimentData,
    labProcedureSettingData,
    opsTeamData,
    locationData,
    studyData,
    subjectDataByType,

    onSuccessfulUpdate,
}) => {
    var { type: experimentType } = experimentData.record;
    
    var permissions = usePermissions();

    var showFunctions = (
        !experimentData.record.state.isCanceled
        && (
            permissions.hasLabOperationFlag(
                experimentType, 'canMoveAndCancelExperiments'
            ) ||
            permissions.hasLabOperationFlag(
                experimentType, 'canChangeOpsTeam'
            )
        )
    );

    var isCanceled = experimentData.record.state.isCanceled;
    var isPlaceholder = experimentData.record.state.subjectData.length < 1;
    return (
        <div>
            <div className='border bg-light p-3'>
                { !isCanceled && isPlaceholder && (
                    <h5 className='text-grey'>
                        Platzhalter
                    </h5>
                )}
                { isCanceled && (
                    <h5 className='text-danger'>
                        Abgesagt
                    </h5>
                )}
                <GeneralInfo { ...({
                    experimentData,
                    opsTeamData,
                    locationData,
                    studyData,
                    onSuccessfulUpdate,
                }) } />
                { showFunctions && (
                    <div className='media-print-hidden'>
                        <hr />
                        <div className='mt-3 d-flex justify-content-between'>
                            <div>
                                <SubjectLabelOnlyContainer { ...({
                                    experimentData,
                                }) } />
                            </div>
                            <div>
                                <GeneralFunctions { ...({
                                    experimentData,
                                    opsTeamData,
                                    studyData,
                                    onSuccessfulUpdate,
                                }) } />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div>
                <Subjects { ...({
                    experimentData,
                    labProcedureSettingData,
                    studyData,
                    subjectDataByType,
                    onSuccessfulUpdate,
                }) } />
            </div>
        </div>
    );
}

export default ExperimentDetails;
