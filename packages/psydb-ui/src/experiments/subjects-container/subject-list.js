import React from 'react';
import { __fixDefinitions, __fixRelated } from '@mpieva/psydb-common-compat';

import { jsonpointer } from '@mpieva/psydb-core-utils';
import { calculateAge } from '@mpieva/psydb-common-lib';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { 
    Table,
    //TableHeadCustomCols
} from '@mpieva/psydb-ui-layout';
import {
    TableHeadCustomCols,
    TableBodyCustomCols
} from '@mpieva/psydb-custom-fields-ui';

import enums from '@mpieva/psydb-schema-enums';
// FIXME
import FieldDataBodyCols from '@mpieva/psydb-ui-lib/src/record-list/field-data-body-cols';

const SubjectList = (ps) => {
    var ps = __fixRelated(ps);

    var {
        experimentRecord,

        records,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
        displayFieldData,
        related,

        className,
        ...other
    } = ps;

    var definitions = __fixDefinitions(displayFieldData);
    var translate = useUITranslation();

    var dateOfBirthField = displayFieldData.find(it => (
        it.props.isSpecialAgeFrameField
    ));
   
    return (
        <Table className={ className }>
            <thead>
                <tr>
                    <TableHeadCustomCols
                        definitions={ definitions }
                    />
                    { dateOfBirthField && (
                        <th>{ translate('T-Age') }</th>
                    )}
                    <th>{ translate('Part. Stud.') }</th>
                    <th>{ translate('Status') }</th>
                    <th>{ translate('Comment') }</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                { records.map(it => (
                    <SubjectListRow { ...({
                        key: it._id,

                        experimentRecord,
        
                        record: it,
                        related,
                        definitions,
                        dateOfBirthField,

                        ...other
                    })} />
                ))}
            </tbody>
        </Table>
    )
}

const SubjectListRow = (ps) => {
    var {
        experimentRecord,

        record,
        related,
        definitions,
        dateOfBirthField,

        ActionsComponent,
    } = ps;

    var translate = useUITranslation();

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

    var hasContactIssue = (
        [ 'mailbox', 'contact-failed' ].includes(invitationStatus)
    );

    var isUnparticipated = (
        enums.unparticipationStatus.keys.includes(participationStatus)
    );

    var rowClass = '';
    if (hasContactIssue) {
        rowClass = 'text-orange';
    }
    if (isUnparticipated) {
        rowClass = 'text-danger';
    }

    return (
        <tr className={ rowClass }>
            <TableBodyCustomCols
                record={ record }
                related={ related }
                definitions={ definitions }
            />
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
            <td>
                { 
                    record.scientific.state
                    .internals.participatedInStudies
                    .filter(it => (
                        it.status === 'participated'
                    ))
                    .map(it => (
                        related.records
                        .study[it.studyId]._recordLabel
                    ))
                    .join(', ')
                } 
            </td>

            <td>{ formattedStatus && translate(formattedStatus) }</td>
            <td><i>{ comment }</i></td>
            <td>
                { ActionsComponent && (
                    <ActionsComponent { ...({
                        experimentSubjectData,
                        subjectRecord: record,

                        hasContactIssue,
                        isUnparticipated
                    }) } />
                )}
            </td>
        </tr>
    );
}

var formatInvitationStatus = (status) => {
    var s = {
        'scheduled': '',
        'confirmed': 'confirmed_icon',
        'mailbox': 'mailbox_icon',
        'contact-failed': 'contact-failed_icon'
    }[status]
    return (
        s === undefined
        ? 'ERROR'
        : s
    )
}

var formatParticipationStatus = (status) => {
    return {
        'unknown': 'unknwon_short',
        'participated': 'participated_short',
        'didnt-participate': 'didnt-participate_short',

        'showed-up-but-didnt-participate': 'showed-up-but-didnt-participate_short',
        'didnt-show-up': 'didnt-show-up_short',
        'canceled-by-participant': 'canceled-by-participant_short',
        'canceled-by-institute': 'canceled-by-institute_short',
        'moved': 'moved_short',
    }[status] || 'ERROR'
}

export default SubjectList;
