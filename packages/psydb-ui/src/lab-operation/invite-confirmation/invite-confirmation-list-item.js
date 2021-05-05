import React, { useReducer, useEffect, useMemo } from 'react';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import applyValueToDisplayFields from '@mpieva/psydb-ui-lib/src/apply-value-to-display-fields';

import {
    Button
} from 'react-bootstrap';

const InviteConfirmationListItem = ({
    experimentRecord,
    experimentOperatorTeamRecords,
    experimentRelated,
    subjectRecordsById,
    subjectRelated,
    subjectDisplayFieldData,
    phoneListField,

    onChangeStatus,
}) => {

    var { state: {
        studyId,
        locationId,
        interval: { start, end },
        subjectData
    }} = experimentRecord;

    start = new Date(start);
    end = new Date(new Date(end).getTime() + 1); // FIXME: 1ms offset

    var {
        relatedRecordLabels
    } = experimentRelated;

    return (
        <div className='border p-3 mb-3 bg-light d-flex'>
            <div style={{ minWidth: '150px' }}>
                <div>
                    { datefns.format(start, 'P')}
                </div>
                <div>
                    <b>
                        { datefns.format(start, 'p') }
                        {' - '}
                        { datefns.format(end, 'p') }
                    </b>
                </div>
            </div>
            <div style={{ width: '250px' }}>
                <div>
                    Studie:
                    {' '}
                    <b>{ relatedRecordLabels.study[studyId]._recordLabel }</b>
                </div>
                <div>
                    Ort:
                    {' '}
                    <b>{ relatedRecordLabels.location[locationId]._recordLabel }</b>
                </div>
                <u>Terminkommentar:</u>
            </div>
            <div className='flex-grow'>
                { 
                    subjectData
                    .filter(it => it.invitationStatus === 'scheduled')
                    .map(it => (
                        <SubjectItem { ...({
                            key: it.subjectId,
                            subjectDataItem: it,
                            subjectRecordsById,
                            subjectRelated,
                            subjectDisplayFieldData,
                            phoneListField,
    
                            experimentRecord,

                            onChangeStatus,
                        }) } />
                    ))
                }
            </div>
        </div>
    );
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
        <div className='d-flex'>
            <div className='flex-grow'>
                { withValue.map(it => (
                    <div className='d-flex' key={ it.key }>
                        <span className='flx-grow w-25'>
                            { it.displayName }
                        </span>
                        <b className='flex-grow ml-3'>{ it.value }</b>
                    </div>
                )) }
                <div className='mt-3 font-weight-bold'>
                    <u>{ phoneListField.displayName }</u>
                    <div>
                        { 
                            subjectRecord
                            .gdpr.state.custom[phoneListField.key]
                            .map((it, index) => {
                                return (
                                    <div key={ index }>
                                        { it.number }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <StatusButton
                        label='NE'
                        onClick={ () => onChangeStatus({
                            status: 'contact-failed',
                            subjectRecord,
                            experimentRecord,
                        }) }
                    />
                    <StatusButton
                        label='AB'
                        onClick={ () => onChangeStatus({
                            status: 'mailbox',
                            subjectRecord,
                            experimentRecord,
                        }) }
                    />
                    <StatusButton
                        label='B'
                        onClick={ () => onChangeStatus({
                            status: 'confirmed',
                            subjectRecord,
                            experimentRecord,
                        }) }
                    />
                </div>
            </div>
        </div>
    )
}

var StatusButton = ({
    label,
    onClick
}) => (
    <Button
        onClick={ onClick }
        variant='outline-primary'
        size='sm'
        className='ml-2'>
        <b
            className='d-inline-block'
            style={{ width: '23px' }}
        >
            { label }
        </b>
    </Button>
)

export default InviteConfirmationListItem;
