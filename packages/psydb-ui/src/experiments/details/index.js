import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import GeneralInfo from '../general-info';
import GeneralFunctions from './general-functions';
import Subjects from './subjects';

import {
    SubjectLabelOnlyContainer,
} from '../shared-general-functions';

const ExperimentDetails = (ps) => {
    var {
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
    } = ps;
    var { type: experimentType } = experimentData.record;
    
    var [{ translate }] = useI18N();
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
                        { translate('Placeholder') }
                    </h5>
                )}
                { isCanceled && (
                    <h5 className='text-danger'>
                        { translate('Canceled') }
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
