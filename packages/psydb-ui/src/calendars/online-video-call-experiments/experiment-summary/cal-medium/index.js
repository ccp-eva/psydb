import React, { useReducer, useEffect, useMemo, useCallback } from 'react';

import { LinkContainer } from '@mpieva/psydb-ui-layout';

import enums from '@mpieva/psydb-schema-enums';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import getTextColor from '@mpieva/psydb-ui-lib/src/bw-text-color-for-background';
import applyValueToDisplayFields from '@mpieva/psydb-ui-lib/src/apply-value-to-display-fields';

import ExperimentDropdown from '@mpieva/psydb-ui-lib/src/experiment-dropdown';
import ExperimentSubjectDropdown from '@mpieva/psydb-ui-lib/src/experiment-subject-dropdown';

import {
    MoveExperimentModal,
    ChangeTeamModal,
    MoveSubjectModal,
    RemoveSubjectModal,
    PerSubjectCommentModal,
} from '@mpieva/psydb-ui-lib/src/modals';

const ExperimentSummaryMedium = ({
    experimentRecord,

    experimentRelated,
    experimentOperatorTeamRecords,
    subjectRecordsById,
    subjectRelated,
    subjectDisplayFieldData,

    url,
    onSuccessfulUpdate,
}) => {

    var moveExperimentModal = useModalReducer({ show: false });
    var changeTeamModal = useModalReducer({ show: false });

    var commentPerSubjectModal = useModalReducer({ show: false });
    var moveSubjectModal = useModalReducer({ show: false });
    var removeSubjectModal = useModalReducer({ show: false });

    var changeStatusThunk = (status) => ({ subjectId }) => {
        var message = {
            type: 'experiment/change-invitation-status',
            payload: {
                experimentId: experimentData.record._id,
                subjectId: subjectId,
                invitationStatus: status
            }
        }

        agent.send({ message })
        .then(response => {
            onSuccessfulUpdate && onSuccessfulUpdate({ response });
        })
    };
    
    var onClickConfirm = changeStatusThunk('confirmed');
    var onClickMailbox = changeStatusThunk('mailbox');
    var onClickContactFailed = changeStatusThunk('contact-failed');

    var experimentData = {
        record: experimentRecord,
        ...experimentRelated,
    };

    var { state: {
        studyId,
        locationId,
        interval: { start, end },
        subjectData,
        experimentOperatorTeamId,
    }} = experimentRecord;

    var teamRecord = experimentOperatorTeamRecords.find(it => (
        it._id === experimentOperatorTeamId
    ));
    
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
                experimentType: 'online-video-call',

                onSuccessfulUpdate,
            }) } />

            <ChangeTeamModal { ...({
                show: changeTeamModal.show,
                onHide: changeTeamModal.handleHide,
                payloadData: changeTeamModal.data,

                experimentId: experimentRecord._id,
                studyId: experimentRecord.state.studyId,
                currentTeamId: experimentRecord.state.experimentOperatorTeamId,

                onSuccessfulUpdate,
            }) } />


            <PerSubjectCommentModal { ...({
                show: commentPerSubjectModal.show,
                onHide: commentPerSubjectModal.handleHide,
                payloadData: commentPerSubjectModal.data,

                experimentData: { record: experimentRecord },
                onSuccessfulUpdate,
            }) } />

            <MoveSubjectModal { ...({
                show: moveSubjectModal.show,
                onHide: moveSubjectModal.handleHide,
                payloadData: moveSubjectModal.data,

                shouldFetch: true,
                experimentId: experimentRecord._id,
                experimentType: 'online-video-call',

                onSuccessfulUpdate,
            }) } />

            <RemoveSubjectModal { ...({
                show: removeSubjectModal.show,
                onHide: removeSubjectModal.handleHide,
                payloadData: removeSubjectModal.data,

                shouldFetch: true,
                experimentId: experimentRecord._id,
                experimentType: 'online-video-call',

                onSuccessfulUpdate,
            }) } />


            
            <div className='d-flex'>
                <div className='flex-grow'>
                    <div>
                        <b>
                            { datefns.format(start, 'p') }
                            {' - '}
                            { datefns.format(end, 'p') }
                        </b>
                    </div>
                    <div>
                        { teamRecord.state.name }
                        {' '}
                        ({
                            experimentRelated.relatedRecordLabels.study[studyId]._recordLabel
                        })
                    </div>
                </div>
                <div
                    style={{ width: '35px' }}
                    className='d-flex flex-column align-items-center'
                >
                    <ExperimentDropdown { ...({
                        experimentType: 'online-video-call',
                        variant: 'calendar',
                        detailsLink: `/experiments/online-video-call/${experimentRecord._id}`,
                        onClickMove: moveExperimentModal.handleShow,
                        onClickChangeTeam: changeTeamModal.handleShow
                    })} />
                </div>
            </div>


            <div className='mt-2'>
                <small><b>Probanden:</b></small>
            </div>
            <ul className='m-0' style={{ paddingLeft: '20px', fontSize: '80%' }}>
                { 
                    subjectData
                    .filter(it => (
                        !enums.unparticipationStatus.keys.includes(
                            it.participationStatus
                        )
                    ))
                    .map(it => (
                        <SubjectItem { ...({
                            key: it.subjectId,
                            subjectDataItem: it,
                            subjectRecordsById,
                            subjectRelated,
                            subjectDisplayFieldData,
    
                            experimentRecord,
                            experimentRelated,

                            onClickComment: commentPerSubjectModal.handleShow,
                            onClickMove: moveSubjectModal.handleShow,
                            onClickRemove: removeSubjectModal.handleShow,

                            onClickConfirm,
                            onClickMailbox,
                            onClickContactFailed,

                        }) } />
                    ))
                }
            </ul>
            {/*<div className='mt-3 d-flex justify-content-end'>
                <LinkContainer
                    style={{
                        color: getTextColor(teamRecord.state.color),
                    }}
                    to={ `/experiments/online-video-call/${experimentRecord._id}` }
                >
                    <a><u>... Details</u></a>
                </LinkContainer>
            </div>*/}
        </div>
    )
}

const SubjectItem = ({
    subjectDataItem,
    experimentOperatorTeamRecords,
    subjectRecordsById,
    subjectRelated,
    subjectDisplayFieldData,
    phoneListField,
    
    experimentRecord,

    onClickComment,
    onClickMove,
    onClickRemove,

    onClickConfirm,
    onClickMailbox,
    onClickContactFailed,
}) => {
    var {
        subjectId,
        invitationStatus,
    } = subjectDataItem;

    var subjectRecord = subjectRecordsById[subjectId];

    var withValue = applyValueToDisplayFields({
        displayFieldData: subjectDisplayFieldData,
        record: subjectRecord,
        ...subjectRelated,
    });

    return (
        <li>
            <div className='d-flex mb-1'>
                <div className='flex-grow'>
                    { withValue.map(it => (
                        <div className='d-flex' key={ it.key }>
                            <span style={{ width: '90px' }}>
                                { it.displayName }
                            </span>
                            <b className='flex-grow ml-3'>{ it.value }</b>
                        </div>
                    )) }
                </div>
                <div
                    style={{ width: '35px' }}
                    className='d-flex flex-column align-items-center'
                >
                    <ExperimentSubjectDropdown { ...({
                        experimentType: 'online-video-call',
                        variant: 'calendar',
                        subjectRecord,
                        
                        onClickComment,
                        onClickMove,
                        onClickRemove,

                        onClickConfirm,
                        onClickMailbox,
                        onClickContactFailed,
                    }) } />
                    { invitationStatus !== 'scheduled' && (
                        <b 
                            className='pl-2 pr-2'
                            style={{ fontSize: '120%', border: '1px solid' }}
                        >
                            { invitationStatusLabels[invitationStatus]}
                        </b>
                    )}
                </div>
            </div>
        </li>
    )
}

const invitationStatusLabels = {
    'scheduled': '',
    'confirmed': 'B',
    'mailbox': 'AB',
    'contact-failed': 'NE',
}

export default ExperimentSummaryMedium;
