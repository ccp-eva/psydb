import React from 'react';
import enums from '@mpieva/psydb-schema-enums';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useModalReducer, useSend } from '@mpieva/psydb-ui-hooks';
import { ColoredBox } from '@mpieva/psydb-ui-layout';

import ExperimentDropdown from '../../experiment-dropdown';

import { CalendarItemInterval } from '../../calendar-item-interval';
import { CalendarPostprocessingStatus } from '../../calendar-postprocessing-status';

import {
    MoveExperimentModal,
    ChangeTeamModal,
    ChangeInviteLocationModal,
    MoveSubjectModal,
    FollowUpSubjectModal,
    RemoveSubjectModal,
    PerSubjectCommentModal,
} from '../../modals';

import {
    CalItemPair,
    SubjectListContainer,
} from '../shared';

import SubjectItem from './subject-item';

const ExperimentSummaryMedium = (ps) => {
    var {
        experimentRecord,

        experimentRelated,
        experimentOperatorTeamRecords,
        subjectRecordsById,
        subjectRelated,
        subjectDisplayFieldData,

        showPast,
        onSuccessfulUpdate,
    } = ps;

    var [{ translate }] = useI18N();

    var moveExperimentModal = useModalReducer({ show: false });
    var changeTeamModal = useModalReducer({ show: false });
    var changeLocationModal = useModalReducer({ show: false });

    var commentPerSubjectModal = useModalReducer({ show: false });
    var moveSubjectModal = useModalReducer({ show: false });
    var followUpSubjectModal = useModalReducer({ show: false });
    var removeSubjectModal = useModalReducer({ show: false });

    var changeStatus = useSend(({ subjectId, status }) => ({
        type: 'experiment/change-invitation-status',
        payload: {
            experimentId: experimentData.record._id,
            subjectId: subjectId,
            invitationStatus: status
        }
    }), { onSuccessfulUpdate });

    var changeStatusThunk = (status) => ({ subjectId }) => (
        changeStatus.exec({ subjectId, status })
    );
    
    var onClickConfirm = changeStatusThunk('confirmed');
    var onClickMailbox = changeStatusThunk('mailbox');
    var onClickContactFailed = changeStatusThunk('contact-failed');

    var experimentData = {
        record: experimentRecord,
        ...experimentRelated,
    };

    var { type: inviteType } = experimentRecord;
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
    // so we dont fetch data of those at all
    if (!showPast && isInPast && (isPlaceholder || isPostprocessed)) {
        return null;
    }

    var _related = experimentRelated.relatedRecordLabels;

    return (
        <ColoredBox
            className='pl-2 pr-2 pb-1 pt-1 mb-2'
            bg={ teamRecord.state.color }
        >

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

            <ChangeInviteLocationModal { ...({
                show: changeLocationModal.show,
                onHide: changeLocationModal.handleHide,
                payloadData: changeLocationModal.data,

                experimentId: experimentRecord._id,
                experimentStart: experimentRecord.state.interval.start,
                experimentEnd: experimentRecord.state.interval.end,
                studyId: experimentRecord.state.studyId,
                currentLocationId: experimentRecord.state.locationId,

                onSuccessfulUpdate,
            }) } />

            <PerSubjectCommentModal { ...({
                ...commentPerSubjectModal.passthrough,

                experimentData: { record: experimentRecord },
                onSuccessfulUpdate,
            }) } />

            <MoveSubjectModal { ...({
                show: moveSubjectModal.show,
                onHide: moveSubjectModal.handleHide,
                payloadData: moveSubjectModal.data,

                shouldFetch: true,
                experimentId: experimentRecord._id,
                experimentType: inviteType,

                onSuccessfulUpdate,
            }) } />

            <FollowUpSubjectModal { ...({
                ...followUpSubjectModal.passthrough,
                payloadData: followUpSubjectModal.data,

                shouldFetch: true,
                experimentId: experimentRecord._id,
                experimentType: inviteType,

                onSuccessfulUpdate,
            }) } />

            <RemoveSubjectModal { ...({
                show: removeSubjectModal.show,
                onHide: removeSubjectModal.handleHide,
                payloadData: removeSubjectModal.data,

                shouldFetch: true,
                experimentId: experimentRecord._id,
                experimentType: inviteType,

                onSuccessfulUpdate,
            }) } />


            
            <div className='d-flex'>
                <div className='flex-grow'>
                    <CalendarItemInterval start={ start } end={ end } />
                </div>
                <div
                    style={{ width: '35px' }}
                    className='d-flex flex-column align-items-center'
                >
                    <ExperimentDropdown { ...({
                        experimentType: inviteType,
                        variant: 'calendar',
                        detailsLink: `/experiments/${inviteType}/${experimentRecord._id}`,
                        onClickMove: moveExperimentModal.handleShow,
                        onClickChangeTeam: changeTeamModal.handleShow,
                        onClickChangeLocation: changeLocationModal.handleShow,
                    })} />
                </div>
            </div>

            { isPlaceholder ? (
                <small className='d-block'>
                    { translate('Placeholder') }
                </small>
            ) : (
                <CalendarPostprocessingStatus
                    shouldPostprocess={ isInPast }
                    isPostprocessed={ isPostprocessed }
                    hasProcessedSubjects={ hasProcessedSubjects }
                />
            )}

            <CalItemPair
                label={ translate('Room') }
                extraClassName='mt-2'
            >
                { _related.location[locationId]._recordLabel }
            </CalItemPair>
            
            <SubjectListContainer label={ translate('Subjects') }>
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
                            inviteType,
                            subjectDataItem: it,
                            subjectRecordsById,
                            subjectRelated,
                            subjectDisplayFieldData,
    
                            onClickComment: commentPerSubjectModal.handleShow,

                            onClickMove: moveSubjectModal.handleShow,
                            ...(experimentRecord._canFollowUp && {
                                onClickFollowUp: followUpSubjectModal.handleShow,
                            }),
                            onClickRemove: removeSubjectModal.handleShow,

                            onClickConfirm,
                            onClickMailbox,
                            onClickContactFailed,
                        }) } />
                    ))
                }
            </SubjectListContainer>

            <CalItemPair
                label={ translate('Team') }
                extraClassName='mt-3'
            >
                { teamRecord.state.name }
            </CalItemPair>
            
            <CalItemPair
                label={ translate('Study') }
                extraClassName=''
            >
                { _related.study[studyId]._recordLabel }
            </CalItemPair>

        </ColoredBox>
    )
}


export default ExperimentSummaryMedium;
