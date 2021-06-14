import React, { useReducer, useEffect, useMemo } from 'react';

import {
    LinkContainer
} from 'react-router-bootstrap';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import getTextColor from '@mpieva/psydb-ui-lib/src/bw-text-color-for-background';

const ExperimentSummarySmall = ({
    experimentRecord,

    experimentRelated,
    experimentOperatorTeamRecords,
    subjectRecordsById,
    subjectRelated,
    subjectDisplayFieldData,

    url,
}) => {
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
            <div className='mt-2 d-flex justify-content-end'>
                <LinkContainer
                    style={{
                        color: getTextColor(teamRecord.state.color),
                    }}
                    to={ `/experiments/inhouse/${experimentRecord._id}` }
                >
                    <a><u>details</u></a>
                </LinkContainer>
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
