import React, { useEffect, useReducer, useCallback } from 'react';
import { unique } from '@mpieva/psydb-core-utils';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import GeneralInfo from '../general-info';
import GeneralFunctions from './general-functions';
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
    var {
        type: experimentType,
        state: { subjectData }
    } = experimentData.record;

    var canPostprocess = permissions.hasLabOperationFlag(
        experimentType, 'canPostprocessExperiments'
    );

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

    var uniqueSubjectTypeKeys = unique(
        labProcedureSettingData.records.map(it => it.subjectTypeKey)
    );
    var isMultiTypeExperiment = uniqueSubjectTypeKeys.length > 1;

    var isPlaceholder = experimentData.record.state.subjectData.length < 1;

    var infoBag = {
        experimentData,
        opsTeamData,
        locationData,
        studyData
    };

    var hasProcessedSubjects = !!subjectData.find(
        it => it.participationStatus !== 'unknown'
    );

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
                    { !isPlaceholder && (
                        hasProcessedSubjects
                        ? <span>in Nachbereitung</span>
                        : <span>offene Nachbereitung</span>
                    )}
                    { isPlaceholder && (
                        <span className='text-grey'>Platzhalter (in Vergangenheit)</span>
                    )}
                </h5>
                <GeneralInfo { ...infoBag } />
                { showFunctions && (
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
            { !isPlaceholder && canPostprocess
                ? (
                    <>
                        <div className='mt-3'>
                            <h4 className='border-bottom'>
                                Nachzubereitende Proband:innen
                            </h4>
                            <PostprocessableSubjects { ...subjectsBag } />
                        </div>
                        <div className='mt-3'>
                            <h4 className='border-bottom'>
                                Nachbereitete Proband:innen
                            </h4>
                            <PostprocessedSubjects { ...subjectsBag } />
                        </div>
                    </>
                )
                : (
                    <AllSubjects { ...subjectsBag } className='p-3' />
                )
            }
        </div>

    );
}

export default ExperimentPostprocessing;
