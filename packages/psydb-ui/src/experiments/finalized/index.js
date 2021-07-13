import React, { useEffect, useReducer, useCallback } from 'react';
import GeneralInfo from '../general-info';
import AllSubjects from './all-subjects';

const ExperimentFinalized = ({
    experimentData,
    experimentOperatorTeamData,
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
                    experimentOperatorTeamData,
                    locationData,
                    studyData
                }) } />
            </div>
            <div>
                <AllSubjects { ...({
                    experimentData,
                    studyData,
                    subjectDataByType,
                }) } />
            </div>
        </div>

    );
}

export default ExperimentFinalized;
