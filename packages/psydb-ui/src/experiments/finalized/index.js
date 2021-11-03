import React, { useEffect, useReducer, useCallback } from 'react';
import GeneralInfo from '../general-info';
import AllSubjects from './all-subjects';

const ExperimentFinalized = ({
    experimentData,
    labProcedureSettingData,
    opsTeamData,
    locationData,
    studyData,
    subjectDataByType,

    onSuccessfulUpdate,
}) => {
    return (
        <div>
            <div className='border bg-light p-3'>
                <h5 className='text-success'>
                    Abgeschlossen
                </h5>
                <GeneralInfo { ...({
                    experimentData,
                    opsTeamData,
                    locationData,
                    studyData
                }) } />
            </div>
            <div>
                <AllSubjects { ...({
                    experimentData,
                    labProcedureSettingData,
                    studyData,
                    subjectDataByType,
                }) } />
            </div>
        </div>

    );
}

export default ExperimentFinalized;
