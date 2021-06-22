import React, { useEffect, useReducer, useCallback } from 'react';
import GeneralInfo from '../general-info';
import Subjects from './subjects';

const ExperimentPostprocessing = ({
    experimentData,
    studyData,
    subjectDataByType,

    onSuccessfulUpdate,
}) => {
    return (
        <div>
            <div className='border bg-light p-3'>
                <h5 className='text-orange'>
                    In Nachbereitung
                </h5>
                <GeneralInfo { ...({
                    experimentData,
                    studyData
                }) } />
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

export default ExperimentPostprocessing;
