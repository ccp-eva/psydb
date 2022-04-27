import React, { useReducer, useEffect, useMemo } from 'react';

import { fixRelated } from '@mpieva/psydb-ui-utils';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    datefns,
    formatDateInterval
} from '@mpieva/psydb-ui-lib';

import applyValueToDisplayFields from '@mpieva/psydb-ui-lib/src/apply-value-to-display-fields';

import ExperimentContainer from './experiment-container';

const InviteConfirmationListItem = (ps) => {

    var {
        experimentRecord,
        experimentOperatorTeamRecords,
        experimentRelated,
        subjectRecordsById,
        subjectRelated,
        subjectDisplayFieldData,
        phoneListField,

        onChangeStatus,
    } = ps;

    var {
        type: experimentType,
        state: experimentState
    } = experimentRecord;

    var {
        studyId,
        locationId,
        interval,
        subjectData
    } = experimentState;

    var {
        relatedRecordLabels
    } = experimentRelated;

    var { startDate, startTime, endTime } = formatDateInterval(interval);

    return (
        <ExperimentContainer
            record={ experimentRecord }
            related={ experimentRelated }
        >
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
        </ExperimentContainer>
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
