import React from 'react';
import enums from '@mpieva/psydb-schema-enums';

import { format as formatDateInterval } from '@mpieva/psydb-date-interval-fns';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { useModalReducer, usePermissions } from '@mpieva/psydb-ui-hooks';

import { bwTextColorForBackground } from '@mpieva/psydb-ui-utils';
import { LinkContainer } from '@mpieva/psydb-ui-layout';

import agent from '@mpieva/psydb-ui-request-agents';

import datefns from '../../date-fns';
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

    var { type: inviteType } = experimentRecord;
    var translate = useUITranslation();
    var locale = useUILocale();
    var permissions = usePermissions();

    var moveExperimentModal = useModalReducer({ show: false });
    var changeTeamModal = useModalReducer({ show: false });
    var changeLocationModal = useModalReducer({ show: false });

    var commentPerSubjectModal = useModalReducer({ show: false });
    var moveSubjectModal = useModalReducer({ show: false });
    var followUpSubjectModal = useModalReducer({ show: false });
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

    start = new Date(start);
    end = new Date(new Date(end).getTime() + 1); // FIXME: 1ms offset

    var { startTime, endTime } = formatDateInterval(
        { start, end },
        { locale }
    );

    return (
        <div className='pl-2 pr-2 pb-1 pt-1 mb-2' style={{
            background: teamRecord.state.color,
            color: bwTextColorForBackground(teamRecord.state.color),
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
                    <div>
                        <b>
                            { startTime }
                            {' - '}
                            { endTime }
                        </b>
                    </div>
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

            { isPlaceholder && (
                <div>
                    <small>{ translate('Placeholder') }</small>
                </div>
            )}
            { !isPlaceholder && !isPostprocessed && hasProcessedSubjects && (
                <div>
                    <small>{ translate('In Postprocessing') }</small>
                </div>
            )}
            { !isPlaceholder && !isPostprocessed && !hasProcessedSubjects && isInPast && (
                <div>
                    <small>{ translate('Open Postprocessing') }</small>
                </div>
            )}
            { isPostprocessed && (
                <div>
                    <small>{ translate('Completed') }</small>
                </div>
            )}

            <div className='d-flex text-small mt-2'>
                <b className='flex-shrink-0' style={{ width: '70px' }}>
                    { translate('Room') }
                </b>
                {
                    experimentRelated.relatedRecordLabels.location[locationId]._recordLabel
                }
            </div>
            <div className=''>
                <small><b>
                    { translate('Subjects') }
                </b></small>
            </div>
            <ul 
                className='m-0'
                style={{ paddingLeft: '20px', fontSize: '80%' }}
            >
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
            </ul>
            <div className='d-flex text-small mt-3'>
                <b className='flex-shrink-0' style={{ width: '70px' }}>
                    { translate('Team') }
                </b>
                { teamRecord.state.name }
            </div>
            <div className='d-flex text-small'>
                <b className='flex-shrink-0' style={{ width: '70px' }}>
                    { translate('Study') }
                </b>
                {
                    experimentRelated.relatedRecordLabels.study[studyId]._recordLabel
                }
            </div>

        </div>
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
                                Kommentar
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
