import React, { useReducer, useEffect, useMemo } from 'react';

import {
    LinkContainer
} from 'react-router-bootstrap';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import getTextColor from '@mpieva/psydb-ui-lib/src/bw-text-color-for-background';
import applyValueToDisplayFields from '@mpieva/psydb-ui-lib/src/apply-value-to-display-fields';

const ExperimentSummaryMedium = ({
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
                    subjectData.map(it => (
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
                    to={ `/experiments/${experimentRecord._id}` }
                >
                    <a><u>details</u></a>
                </LinkContainer>
            </div>
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

    onChangeStatus,
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
            <div className='d-flex'>
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
            </div>
        </li>
    )
}



export default ExperimentSummaryMedium;
