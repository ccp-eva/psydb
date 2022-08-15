import React, { useReducer, useEffect, useMemo } from 'react';

import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { LinkContainer } from '@mpieva/psydb-ui-layout';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import getTextColor from '@mpieva/psydb-ui-lib/src/bw-text-color-for-background';

import ExperimentDropdown from '@mpieva/psydb-ui-lib/src/experiment-dropdown';
import {
    MoveExperimentModal,
    ChangeTeamModal,
} from '@mpieva/psydb-ui-lib/src/modals';

const ExperimentSummarySmall = ({
    inviteType,
    experimentRecord,

    experimentRelated,
    experimentOperatorTeamRecords,
    subjectRecordsById,
    subjectRelated,
    subjectDisplayFieldData,

    url,
    showPast,
    onSuccessfulUpdate,
}) => {
    var moveExperimentModal = useModalReducer({ show: false });
    var changeTeamModal = useModalReducer({ show: false });

    var { state: {
        studyId,
        locationId,
        interval: { start, end },
        subjectData,
        experimentOperatorTeamId,
        isPostprocessed,
    }} = experimentRecord;

    var teamRecord = experimentOperatorTeamRecords.find(it => (
        it._id === experimentOperatorTeamId
    ));
    
    var isInPast = new Date().getTime() > new Date(end).getTime();
    var hasProcessedSubjects = !!subjectData.find(
        it => it.participationStatus !== 'unknown'
    );
    var isPlaceholder = subjectData.length < 1;

    // TODO: we might also want to send a flag to api
    // so we dont send dent data of those at all
    if (!showPast && isInPast && (isPlaceholder || isPostprocessed)) {
        return null;
    }

    start = new Date(start);
    end = new Date(new Date(end).getTime() + 1); // FIXME: 1ms offset

    return (
        <div className='pl-2 pr-2 pb-1 pt-1 mb-2' style={{
            background: teamRecord.state.color,
            color: getTextColor(teamRecord.state.color),
        }}>
            
            <MoveExperimentModal { ...({
                show: moveExperimentModal.show,
                onHide: moveExperimentModal.handleHide,
                payloadData: moveExperimentModal.data,

                shouldFetch: true,
                experimentId: experimentRecord._id,
                experimentType: inviteType,

                onSuccessfulUpdate,
            }) } />

            <ChangeTeamModal { ...({
                show: changeTeamModal.show,
                onHide: changeTeamModal.handleHide,
                payloadData: changeTeamModal.data,

                experimentType: inviteType,
                experimentId: experimentRecord._id,
                studyId: experimentRecord.state.studyId,
                currentTeamId: experimentRecord.state.experimentOperatorTeamId,

                onSuccessfulUpdate,
            }) } />


            <div>
                <b>
                    { datefns.format(start, 'p') }
                    {' - '}
                    { datefns.format(end, 'p') }
                </b>
            </div>
            
            { isPlaceholder && (
                <div>
                    <small>Platzhalter</small>
                </div>
            )}
            { !isPlaceholder && !isPostprocessed && hasProcessedSubjects && (
                <div>
                    <small>in Nachbereitung</small>
                </div>
            )}
            { !isPlaceholder && !isPostprocessed && !hasProcessedSubjects && isInPast && (
                <div>
                    <small>offene Nachbereitung</small>
                </div>
            )}
            { isPostprocessed && (
                <div>
                    <small>Abgeschlossen</small>
                </div>
            )}

            <div className='d-flex text-small mt-2'>
                <b className='flex-shrink-0' style={{ width: '70px' }}>Raum</b>
                {
                    experimentRelated.relatedRecordLabels.location[locationId]._recordLabel
                }
            </div>
            <div className=''>
                <small><b>Proband:innen:</b></small>
            </div>
            <ul className='m-0' style={{ paddingLeft: '20px', fontSize: '80%' }}>
                { 
                    subjectData
                    .filter(it => (
                        ![
                            'canceled-by-participant',
                            'canceled-by-institute',
                            'deleted-by-institute'
                        ].includes(it.participationStatus)
                    ))
                    .map(it => (
                        <SubjectItem { ...({
                            inviteType,
                            key: it.subjectId,
                            subjectDataItem: it,
                            subjectRecordsById,
                            subjectRelated,
                            subjectDisplayFieldData,
    
                            experimentRecord,
                            experimentRelated,
                        }) } />
                    ))
                }
            </ul>
            <div className='d-flex text-small mt-3'>
                <b className='flex-shrink-0' style={{ width: '70px' }}>Team</b>
                { teamRecord.state.name }
            </div>
            <div className='d-flex text-small'>
                <b className='flex-shrink-0' style={{ width: '70px' }}>Studie</b>
                {
                    experimentRelated.relatedRecordLabels.study[studyId]._recordLabel
                }
            </div>
            <div className='mt-1 d-flex justify-content-end'>
                <ExperimentDropdown { ...({
                    experimentType: inviteType,
                    variant: 'calendar',
                    detailsLink: `/experiments/${inviteType}/${experimentRecord._id}`,
                    onClickMove: moveExperimentModal.handleShow,
                    onClickChangeTeam: changeTeamModal.handleShow
                })} />
            </div>
        </div>
    )
}

const SubjectItem = ({
    inviteType,
    subjectDataItem,
    subjectRecordsById,
    subjectRelated,
    subjectDisplayFieldData,
    phoneListField,
    
    experimentRecord,
    experimentRelated,

    onChangeStatus,
}) => {
    var {
        subjectId,
        invitationStatus,
    } = subjectDataItem;

    return (
        <li>
            <span style={{ position: 'relative', left: '-5px' }}>
                { experimentRelated.relatedRecordLabels.subject[subjectId]._recordLabel }
            </span>
        </li>
    )
}


export default ExperimentSummarySmall;
