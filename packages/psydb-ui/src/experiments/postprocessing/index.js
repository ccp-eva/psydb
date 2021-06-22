import React, { useEffect, useReducer, useCallback } from 'react';
import GeneralInfo from '../general-info';
import AllSubjects from './all-subjects';
import PostprocessableSubjects from './postprocessable-subjects';

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
            <div className='mt-3'>
                <h4 className='border-bottom'>
                    Nachzubereitende Probanden
                </h4>
                <PostprocessableSubjects { ...({
                    experimentData,
                    studyData,
                    subjectDataByType,
                    onSuccessfulUpdate,
                })} />
            </div>
            <div className='mt-3'>
                <h4 className='border-bottom'>
                    Alle Probanden
                </h4>
                <AllSubjects { ...({
                    experimentData,
                    studyData,
                    subjectDataByType,
                }) } />
            </div>
        </div>

    );
}

export default ExperimentPostprocessing;
