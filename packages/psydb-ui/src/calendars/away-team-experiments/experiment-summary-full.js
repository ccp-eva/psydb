import React, { useReducer, useEffect, useMemo, useCallback } from 'react';

import {
    LinkContainer
} from 'react-router-bootstrap';

import enums from '@mpieva/psydb-schema-enums';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import useModalReducer from '@mpieva/psydb-ui-lib/src/use-modal-reducer';
import getTextColor from '@mpieva/psydb-ui-lib/src/bw-text-color-for-background';
import applyValueToDisplayFields from '@mpieva/psydb-ui-lib/src/apply-value-to-display-fields';

import ExperimentDropdown from '@mpieva/psydb-ui-lib/src/experiment-dropdown';

import {
    FollowUpExperimentModal,
    MoveExperimentModal,
    ChangeTeamModal,
} from '@mpieva/psydb-ui-lib/src/modals';

const ExperimentSummaryFull = ({
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

    var moveExperimentModal = useModalReducer({ show: false });
    var followupExperimentModal = useModalReducer({ show: false });
    var changeTeamModal = useModalReducer({ show: false });

    var experimentData = {
        record: experimentRecord,
        ...experimentRelated,
    };

    var { state: {
        studyId,
        locationId,
        interval: { start, end },
        experimentOperatorTeamId,
    }} = experimentRecord;

    var locationRecord = locationRecordsById[locationId];

    var teamRecord = experimentOperatorTeamRecords.find(it => (
        it._id === experimentOperatorTeamId
    ));
    
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
                        experimentType: 'away-team',
                        variant: 'calendar',
                        detailsLink: `/experiments/away-team/${experimentRecord._id}`,
                        onClickMove: moveExperimentModal.handleShow,
                        onClickFollowUp: followupExperimentModal.handleShow,
                        onClickChangeTeam: changeTeamModal.handleShow
                    })} />
                </div>
            </div>
            
            <div className='mt-2 mb-2'>
                <u className='d-block'>Location:</u>
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

    var withValue = applyValueToDisplayFields({
        displayFieldData: locationDisplayFieldData,
        record: locationRecord,
        ...locationRelated,
    });

    return (
        <div style={{ fontSize: '80%' }}>
            { withValue.map(it => (
                <div className='d-flex' key={ it.key }>
                    <span style={{ width: '90px' }}>
                        { it.displayName }
                    </span>
                    <b className='flex-grow ml-3'>{ it.value }</b>
                </div>
            )) }
        </div>
    )
}

export default ExperimentSummaryFull;
