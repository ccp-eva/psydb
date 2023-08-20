import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { ColoredBox } from '@mpieva/psydb-ui-layout';

import {
    ExperimentDropdown,
    CalendarPostprocessingStatus
} from '@mpieva/psydb-ui-lib';

import {
    FollowUpExperimentModal,
    MoveExperimentModal,
    CancelExperimentModal,
    ChangeTeamModal,
} from '@mpieva/psydb-ui-lib/src/modals';

const ExperimentSummary = (ps) => {
    var {
        experimentRecord,
        experimentRelated,
        experimentOperatorTeamRecords,

        locationRecordsById,
        locationRelated,
        locationDisplayFieldData,

        url,
        showPast,
        onSuccessfulUpdate,

        style,
    } = ps;

    var translate = useUITranslation();

    var changeTeamModal = useModalReducer({ show: false });
    var moveExperimentModal = useModalReducer({ show: false });
    var followupExperimentModal = useModalReducer({ show: false });
    var cancelExperimentModal = useModalReducer({ show: false });

    var experimentData = {
        record: experimentRecord,
        ...experimentRelated,
    };

    var { state: {
        studyId,
        locationId,
        interval: { start, end },
        experimentOperatorTeamId,
        subjectData,
        isPostprocessed,
    }} = experimentRecord;

    var locationRecord = locationRecordsById[locationId];

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
    
    return (
        <ColoredBox
            className='pl-2 pr-2 pb-1 pt-1 mb-2'
            bg={ teamRecord.state.color }
            extraStyle={ style }
        >

            <MoveExperimentModal { ...({
                show: moveExperimentModal.show,
                onHide: moveExperimentModal.handleHide,
                payloadData: moveExperimentModal.data,

                shouldFetch: true,
                experimentId: experimentRecord._id,
                experimentType: 'away-team',

                onSuccessfulUpdate,
            }) } />

            <FollowUpExperimentModal { ...({
                show: followupExperimentModal.show,
                onHide: followupExperimentModal.handleHide,
                payloadData: followupExperimentModal.data,

                shouldFetch: true,
                experimentId: experimentRecord._id,
                experimentType: 'away-team',

                onSuccessfulUpdate,
            }) } />

            <CancelExperimentModal { ...({
                show: cancelExperimentModal.show,
                onHide: cancelExperimentModal.handleHide,
                payloadData: cancelExperimentModal.data,

                experimentId: experimentRecord._id,
                experimentType: 'away-team',

                onSuccessfulUpdate,
            }) } />

            <ChangeTeamModal { ...({
                show: changeTeamModal.show,
                onHide: changeTeamModal.handleHide,
                payloadData: changeTeamModal.data,

                experimentType: 'away-team',
                experimentId: experimentRecord._id,
                studyId: experimentRecord.state.studyId,
                currentTeamId: experimentRecord.state.experimentOperatorTeamId,

                onSuccessfulUpdate,
            }) } />


            <div className='d-flex'>
                <div className='flex-grow'>
                    <div className='text-small'>
                        { teamRecord.state.name }
                    </div>
                </div>
                <div
                    style={{ width: '35px' }}
                    className='d-flex flex-column align-items-center'
                >
                    <ExperimentDropdown { ...({
                        experimentType: 'away-team',
                        variant: 'calendar',
                        detailsLink: `/experiments/away-team/${experimentRecord._id}`,
                        onClickMove: (
                            hasProcessedSubjects
                            ? undefined
                            : moveExperimentModal.handleShow
                        ),
                        onClickCancel: (
                            hasProcessedSubjects
                            ? undefined
                            : cancelExperimentModal.handleShow
                        ),
                        onClickChangeTeam: (
                            hasProcessedSubjects
                            ? undefined
                            : changeTeamModal.handleShow
                        ),
                        onClickFollowUp: followupExperimentModal.handleShow,
                    })} />
                </div>
            </div>
            
            <div className='mt-2 mb-2'>
                <LocationInfo { ...({
                    locationRecord,
                    locationRelated,
                    locationDisplayFieldData,
                }) } />
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

        </ColoredBox>
    )
}

const LocationInfo = (ps) => {
    var {
        locationRecord,
        locationRelated,
        locationDisplayFieldData,
    } = ps;

    return (
        <div style={{ fontSize: '100%' }}>
            <b>{ locationRecord._recordLabel }</b>
        </div>
    )
}

export default ExperimentSummary;
