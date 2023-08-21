import React from 'react';
import { unique } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import GeneralInfo from '../general-info';
import GeneralFunctions from './general-functions';
import AllSubjects from './all-subjects';
import AutoProcessButton from './auto-process-button';
import PostprocessableSubjects from './postprocessable-subjects';
import PostprocessedSubjects from './postprocessed-subjects';

const ExperimentPostprocessing = (ps) => {
    var {
        experimentData,
        labProcedureSettingData,
        opsTeamData,
        locationData,
        studyData,
        subjectDataByType,

        onSuccessfulUpdate,
    } = ps;

    var translate = useUITranslation();
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
        studyData,
        onSuccessfulUpdate,
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
                    { isPlaceholder ? (
                        <span className='text-grey'>
                            { translate('Placeholder (in Past)') }
                        </span>
                    ) : (
                        hasProcessedSubjects
                        ? <span>{ translate('In Postprocessing') }</span>
                        : <span>{ translate('Open Postprocessing') }</span>
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
                    <ProcessingLists
                        experimentData={ experimentData }
                        onSuccessfulUpdate={ onSuccessfulUpdate }
                        subjectsBag={ subjectsBag }
                    />
                )
                : (
                    <AllSubjects { ...subjectsBag } className='p-3' />
                )
            }
        </div>

    );
}

const ProcessingLists = (ps) => {
    var {
        experimentData,
        onSuccessfulUpdate,
        subjectsBag
    } = ps;
    
    var translate = useUITranslation();

    return (
        <>
            <div className='mt-3'>
                <h4 className='border-bottom d-flex justify-content-between pb-1'>
                    { translate('Subjects to Postprocess') }
                    { experimentData.record.type === 'away-team' && (
                        <AutoProcessButton
                            experimentId={ experimentData.record._id }
                            onSuccessfulUpdate={ onSuccessfulUpdate }
                        />
                    )}
                </h4>
                <PostprocessableSubjects { ...subjectsBag } />
            </div>
            <div className='mt-3'>
                <h4 className='border-bottom pb-1'>
                    { translate('Postprocessed Subjects') }
                </h4>
                <PostprocessedSubjects { ...subjectsBag } />
            </div>
        </>
    )
}

export default ExperimentPostprocessing;
