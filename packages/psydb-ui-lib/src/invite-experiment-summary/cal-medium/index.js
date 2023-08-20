import React from 'react';
import enums from '@mpieva/psydb-schema-enums';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useModalReducer, useSend } from '@mpieva/psydb-ui-hooks';
import { ColoredBox } from '@mpieva/psydb-ui-layout';

import applyValueToDisplayFields from '../../apply-value-to-display-fields';
import ExperimentDropdown from '../../experiment-dropdown';
import ExperimentSubjectDropdown from '../../experiment-subject-dropdown';

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
    CalItemInterval,
    CalItemPair,
    SubjectListContainer,
    PostprocessingStatus
} from '../shared';

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

    var translate = useUITranslation();

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
                    <CalItemInterval start={ start } end={ end } />
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
                <PostprocessingStatus
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
    
                            experimentRecord,
                            experimentRelated,

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

const SubjectItem = ({
    inviteType,
    subjectDataItem,
    experimentOperatorTeamRecords,
    subjectRecordsById,
    subjectRelated,
    subjectDisplayFieldData,
    
    experimentRecord,

    onClickComment,
    onClickMove,
    onClickFollowUp,
    onClickRemove,

    onClickConfirm,
    onClickMailbox,
    onClickContactFailed,
}) => {
    var translate = useUITranslation();

    var {
        subjectId,
        invitationStatus,
        comment,
    } = subjectDataItem;

    var subjectRecord = subjectRecordsById[subjectId];

    var withValue = applyValueToDisplayFields({
        displayFieldData: (
            Array.isArray(subjectDisplayFieldData)
            ? subjectDisplayFieldData
            : subjectDisplayFieldData[subjectRecord.type]
        ),
        record: subjectRecord,
        ...subjectRelated,
    });

    return (
        <li>
            <div className='d-flex mb-1'>
                <div className='flex-grow'>
                    { withValue.map(it => (
                        it.value === undefined || it.value === ''
                        ? null
                        : (
                            <div className='d-flex' key={ it.key }>
                                <span style={{ width: '90px' }}>
                                    { it.displayName }
                                </span>
                                <b className='flex-grow ml-3'>{ it.value }</b>
                            </div>
                        )
                    )) }
                    { comment && (
                        <div className='d-flex'>
                            <span style={{ width: '90px' }}>
                                { translate('Comment') }
                            </span>
                            <i className='flex-grow ml-3'>{ comment }</i>
                        </div>
                    )}
                </div>
                <div
                    style={{ width: '35px' }}
                    className='d-flex flex-column align-items-center'
                >
                    <ExperimentSubjectDropdown { ...({
                        experimentType: inviteType,
                        variant: 'calendar',
                        subjectRecord,
                        
                        onClickComment,
                        onClickMove,
                        onClickFollowUp,
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
                            { translate(invitationStatusLabels[invitationStatus] )}
                        </b>
                    )}
                </div>
            </div>
        </li>
    )
}

const invitationStatusLabels = {
    'confirmed': 'confirmed_icon',
    'mailbox': 'mailbox_icon',
    'contact-failed': 'contact-failed_icon',
}

export default ExperimentSummaryMedium;
