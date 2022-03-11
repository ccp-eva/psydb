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
                experimentType: 'inhouse',

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


            <div>
                <b>
                    { datefns.format(start, 'p') }
                    {' - '}
                    { datefns.format(end, 'p') }
                </b>
            </div>
            <div className='mt-2'>
                <small><b>Probanden:</b></small>
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
                <b style={{ width: '70px' }}>Team</b>
                { teamRecord.state.name }
            </div>
            <div className='d-flex text-small'>
                <b style={{ width: '70px' }}>Studie</b>
                {
                    experimentRelated.relatedRecordLabels.study[studyId]._recordLabel
                }
            </div>
            <div className='mt-1 d-flex justify-content-end'>
                <ExperimentDropdown { ...({
                    experimentType: 'inhouse',
                    variant: 'calendar',
                    detailsLink: `/experiments/inhouse/${experimentRecord._id}`,
                    onClickMove: moveExperimentModal.handleShow,
                    onClickChangeTeam: changeTeamModal.handleShow
                })} />
            </div>
        </div>
    )
}

const SubjectItem = ({
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
