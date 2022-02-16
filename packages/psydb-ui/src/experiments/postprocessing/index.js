import React, { useEffect, useReducer, useCallback } from 'react';
import { unique } from '@mpieva/psydb-core-utils';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import GeneralInfo from '../general-info';
import AllSubjects from './all-subjects';
import PostprocessableSubjects from './postprocessable-subjects';
import PostprocessedSubjects from './postprocessed-subjects';

const ExperimentPostprocessing = ({
    experimentData,
    labProcedureSettingData,
    opsTeamData,
    locationData,
    studyData,
    subjectDataByType,

    onSuccessfulUpdate,
}) => {
    var permissions = usePermissions();
    var { type: experimentType } = experimentData.record;

    var canPostprocess = permissions.hasLabOperationFlag(
        experimentType, 'canPostprocessExperiments'
    );

    var uniqueSubjectTypeKeys = unique(
        labProcedureSettingData.records.map(it => it.subjectTypeKey)
    );
    var isMultiTypeExperiment = uniqueSubjectTypeKeys.length > 1;

    var infoBag = {
        experimentData,
        opsTeamData,
        locationData,
        studyData
    };

    var subjectsBag = {
        ...(isMultiTypeExperiment && {
            className: 'p-3',
        }),
        isMultiTypeExperiment,
        experimentData,
        labProcedureSettingData,
        studyData,
        subjectDataByType,
        onSuccessfulUpdate,
    }

    return (
        <div>
            <div className='border bg-light p-3'>
                <h5 className='text-orange'>
                    In Nachbereitung
                </h5>
                <GeneralInfo { ...infoBag } />
            </div>
            { canPostprocess
                ? (
                    <>
                        <div className='mt-3'>
                            <h4 className='border-bottom'>
                                Nachzubereitende Probanden
                            </h4>
                            <PostprocessableSubjects { ...subjectsBag } />
                        </div>
                        <div className='mt-3'>
                            <h4 className='border-bottom'>
                                Nachbereitete Probanden
                            </h4>
                            <PostprocessedSubjects { ...subjectsBag } />
                        </div>
                    </>
                )
                : (
                    <AllSubjects { ...subjectsBag } />
                )
            }
        </div>

    );
}

export default ExperimentPostprocessing;
