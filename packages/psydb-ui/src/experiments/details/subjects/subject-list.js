import React from 'react';
import jsonpointer from 'jsonpointer';
import { Table } from 'react-bootstrap';

import enums from '@mpieva/psydb-schema-enums';
import calculateAge from '@mpieva/psydb-ui-lib/src/calculate-age';
import FieldDataHeadCols from '@mpieva/psydb-ui-lib/src/record-list/field-data-head-cols';
import FieldDataBodyCols from '@mpieva/psydb-ui-lib/src/record-list/field-data-body-cols';

import SubjectDropdown from '@mpieva/psydb-ui-lib/src/experiment-subject-dropdown';

const SubjectList = ({
    experimentRecord,

    records,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    displayFieldData,

    className,
    ...other
}) => {
    var dateOfBirthField = displayFieldData.find(it => (
        it.props.isSpecialAgeFrameField
    ));
   
    return (
        <Table className={ className }>
            <thead>
                <tr>
                    <FieldDataHeadCols
                        displayFieldData={ displayFieldData }
                    />
                    { dateOfBirthField && (
                        <th>Alter im Test</th>
                    )}
                    <th>Status</th>
                    <th>Kommentar</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                { records.map(it => (
                    <SubjectListRow { ...({
                        key: it._id,

                        experimentRecord,
                        
                        record: it,
                        relatedRecordLabels,
                        relatedHelperSetItems,
                        relatedCustomRecordTypeLabels,
                        displayFieldData,
                        dateOfBirthField,

                        ...other
                    })} />
                ))}
            </tbody>
        </Table>
    )
}

const SubjectListRow = ({
    experimentRecord,

    record,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    displayFieldData,
    dateOfBirthField,

    onClickComment,
    onClickMove,
    onClickRemove,
}) => {
    var experimentSubjectData = (
        experimentRecord.state.subjectData.find(it => (
            it.subjectId === record._id
        ))
    );
    
    var {
        invitationStatus,
        participationStatus,
        comment
    } = experimentSubjectData;

    var formattedStatus = (
        participationStatus === 'unknown'
        ? formatInvitationStatus(invitationStatus)
        : formatParticipationStatus(participationStatus)
    );

    var isUnparticipated = (
        enums.unparticipationStatus.keys.includes(participationStatus)
    )

    return (
        <tr className={ isUnparticipated ? 'text-danger' : '' }>
            <FieldDataBodyCols { ...({
                record,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,
                displayFieldData,
            })} />
            <td>
                { 
                    calculateAge({
                        base: jsonpointer.get(
                            record, dateOfBirthField.dataPointer
                        ),
                        relativeTo: experimentRecord.state.interval.start
                    })
                }
            </td>
            <td>{ formattedStatus }</td>
            <td><i>{ comment }</i></td>
            <td>
                <SubjectDropdown { ...({
                    subjectRecord: record,
                    onClickComment,
                    onClickMove,
                    onClickRemove,

                    disabled: isUnparticipated,
                }) } />
            </td>
        </tr>
    );
}

var formatInvitationStatus = (status) => {
    var s = {
        'scheduled': '',
        'confirmed': 'B',
        'mailbox': 'AB',
        'contact-failed': 'NE'
    }[status]
    return (
        s === undefined
        ? 'ERROR'
        : s
    )
}

var formatParticipationStatus = (status) => {
    return {
        'unknown': 'unb.',
        'participated': 't.g.',
        'showed-up-but-didnt-participate': 'n.t.g',
        'did-show-up': 'ersch.',
        'didnt-show-up': 'n. ersch.',
        'canceled-by-participant': 'abg.',
        'canceled-by-institute': 'ausg.',
        'removed': 'entf.',
        'moved': 'versch.',
    }[status] || 'ERROR'
}

export default SubjectList;
