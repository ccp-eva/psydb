import React, { useCallback } from 'react';
import jsonpointer from 'jsonpointer';

import {
    Table,
    Dropdown,
    DropdownButton,
    DropdownType,
} from 'react-bootstrap';

import {
    GearFill
} from 'react-bootstrap-icons';

import calculateAge from '@mpieva/psydb-ui-lib/src/calculate-age';
import FieldDataHeadCols from '@mpieva/psydb-ui-lib/src/record-list/field-data-head-cols';
import FieldDataBodyCols from '@mpieva/psydb-ui-lib/src/record-list/field-data-body-cols';

import TableButton from './table-button';

import createStringifier from './record-field-stringifier';

const Subjects = ({
    experimentData,
    studyData,
    subjectDataByType,
    onSuccessfulUpdate,
}) => {
    var { selectionSettingsBySubjectType } = studyData.record.state;
    var stringifyStudyValue = createStringifier(studyData);
    return (
        <div className='p-3'>
            { selectionSettingsBySubjectType.map((it, index) => {
                var {
                    subjectRecordType,
                    subjectsPerExperiment
                } = it;
                
                var subjectTypeLabel = stringifyStudyValue({
                    ptr: `/state/selectionSettingsBySubjectType/${index}/subjectRecordType`,
                    collection: 'subject',
                    type: 'CustomRecordTypeKey',
                });

                var fullSubjectData = subjectDataByType[subjectRecordType];
                if (fullSubjectData.records.length < 1) {
                    return null;
                }
                
                return (
                    <SubjectsOfType { ...({
                        key: subjectRecordType,
                        subjectTypeKey: subjectRecordType,
                        subjectTypeLabel,
                        subjectsPerExperiment,
                        experimentData,
                        fullSubjectData,
                    })} />
                );
            })}
        </div>
    )
}

const SubjectsOfType = ({
    subjectTypeKey,
    subjectTypeLabel,
    subjectsPerExperiment,
    experimentData,
    fullSubjectData,
}) => {
    return (
        <div>
            <h5 className=''>
                { subjectTypeLabel }
                {' '}
                (
                    { fullSubjectData.records.length }
                    /
                    { subjectsPerExperiment }
                )
            </h5>
            <SubjectList { ...({
                experimentRecord: experimentData.record,
                ...fullSubjectData
            }) } />
        </div>
    )
}

const SubjectList = ({
    experimentRecord,

    records,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    displayFieldData,

    className,
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

    return (
        <tr>
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
                    subjectId: record._id,
                    onClickComment,
                    onClickMove,
                    onClickRemove,
                }) } />
            </td>
        </tr>
    );
}

var SubjectDropdown = ({
    subjectId,
    onClickComment,
    onClickMove,
    onClickRemove,
}) => {
    var wrappedOnClickComment = useCallback(() => (
        onClickComment({ subjectId })
    ), [ onClickComment ]);

    var wrappedOnClickMove = useCallback(() => (
        onClickMove({ subjectId })
    ), [ onClickMove ]);

    var wrappedOnClickRemove = useCallback(() => (
        onClickRemove({ subjectId })
    ), [ onClickRemove ]);

    return (
        <Dropdown>
            <Dropdown.Toggle size='sm' variant='outline-primary' style={{
                borderRadius: '.2rem',
                border: 0,
            }} bsPrefix='dropdown-toggle-no-caret'>
                <GearFill style={{
                    width: '18px',
                    height: '18px',
                    marginTop: '-3px',
                }} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item as='button' onClick={ wrappedOnClickComment }>
                    Kommentar
                </Dropdown.Item>
                <Dropdown.Item as='button' onClick={ wrappedOnClickMove }>
                    Verschieben
                </Dropdown.Item>
                <Dropdown.Item as='button' onClick={ wrappedOnClickRemove }>
                    Entfernen
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
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
    }[status] || 'ERROR'
}

export default Subjects;
