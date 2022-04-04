import React, { useReducer, useEffect, useMemo, useCallback } from 'react';

import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { LinkContainer } from '@mpieva/psydb-ui-layout';

import enums from '@mpieva/psydb-schema-enums';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import getTextColor from '@mpieva/psydb-ui-lib/src/bw-text-color-for-background';
import applyValueToDisplayFields from '@mpieva/psydb-ui-lib/src/apply-value-to-display-fields';

import ExperimentDropdown from '@mpieva/psydb-ui-lib/src/experiment-dropdown';

import {
    FollowUpExperimentModal,
    MoveExperimentModal,
    CancelExperimentModal,
    ChangeTeamModal,
} from '@mpieva/psydb-ui-lib/src/modals';

const ExperimentSummary = ({
    experimentRecord,
    experimentRelated,
    experimentOperatorTeamRecords,

    locationRecordsById,
    locationRelated,
    locationDisplayFieldData,

    url,
    onSuccessfulUpdate,

    style,
}) => {

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
    }} = experimentRecord;

    var locationRecord = locationRecordsById[locationId];

    var teamRecord = experimentOperatorTeamRecords.find(it => (
        it._id === experimentOperatorTeamId
    ));

    var hasProcessedSubjects = !!subjectData.find(
        it => it.participationStatus !== 'unknown'
    );
    
    start = new Date(start);
    end = new Date(new Date(end).getTime() + 1); // FIXME: 1ms offset

    return (
        <div className='pl-2 pr-2 pb-1 pt-1 mb-2' style={{
            background: teamRecord.state.color,
            color: getTextColor(teamRecord.state.color),
            ...style
        }}>

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
                        onClickMove: moveExperimentModal.handleShow,
                        onClickFollowUp: followupExperimentModal.handleShow,
                        onClickCancel: (
                            hasProcessedSubjects
                            ? undefined
                            : cancelExperimentModal.handleShow
                        ),
                        onClickChangeTeam: changeTeamModal.handleShow
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
        </div>
    )
}

const LocationInfo = ({
    locationRecord,
    locationRelated,
    locationDisplayFieldData,
}) => {

    return (
        <div style={{ fontSize: '100%' }}>
            <b>{ locationRecord._recordLabel }</b>
        </div>
    )
}

export default ExperimentSummary;
