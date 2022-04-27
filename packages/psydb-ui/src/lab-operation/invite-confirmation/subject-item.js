import React from 'react';
import { Button } from '@mpieva/psydb-ui-layout';

import applyValueToDisplayFields from '@mpieva/psydb-ui-lib/src/apply-value-to-display-fields';

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
        comment,
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
                { withValue.map((it, ix) => (
                    <div className='d-flex' key={ ix }>
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
                { comment && (
                    <div className='mt-3'>
                        <b><u>Kommentar</u></b>
                        <div>
                            <i>{ comment }</i>
                        </div>
                    </div>
                )}
            </div>
            <div>
                <div>
                    <StatusButton
                        label='NE'
                        buttonStatus='contact-failed'
                        currentStatus={ invitationStatus }
                        onClick={ (status) => onChangeStatus({
                            status,
                            subjectRecord,
                            experimentRecord,
                        }) }
                    />
                    <StatusButton
                        label='AB'
                        buttonStatus='mailbox'
                        currentStatus={ invitationStatus }
                        onClick={ (status) => onChangeStatus({
                            status,
                            subjectRecord,
                            experimentRecord,
                        }) }
                    />
                    <StatusButton
                        label='B'
                        buttonStatus='confirmed'
                        currentStatus={ invitationStatus }
                        onClick={ (status) => onChangeStatus({
                            status,
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
    buttonStatus,
    currentStatus,
    onClick
}) => {
    var variant = (
        buttonStatus === currentStatus
        ? 'primary'
        : 'outline-secondary'
    );
    return (
        <Button
            onClick={ () => onClick(buttonStatus) }
            variant={ variant }
            size='sm'
            className='ml-2'>
            <b
                className='d-inline-block'
                style={{ width: '23px' }}
            >
                { label }
            </b>
        </Button>
    );
}

export default SubjectItem;
