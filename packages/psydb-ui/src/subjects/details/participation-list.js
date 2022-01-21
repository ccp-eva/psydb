import React from 'react';
import {
    Table,
    StudyIconButton,
} from '@mpieva/psydb-ui-layout';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import calculateAge from '@mpieva/psydb-ui-lib/src/calculate-age';

import FieldDataHeadCols from '@mpieva/psydb-ui-lib/src/record-list/field-data-head-cols';
import FieldDataBodyCols from '@mpieva/psydb-ui-lib/src/record-list/field-data-body-cols';

const ParticipationList = ({
    studyType,
    ageFrameField,
    ageFrameFieldValue,

    participation,
    studyRecordsById,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    displayFieldData
}) => {
    return (
        <Table className='bg-white border'>
            <thead>
                <tr>
                    <FieldDataHeadCols
                        displayFieldData={ displayFieldData }
                    />
                    <th>Zeitpunkt</th>
                    { ageFrameField && (
                        <th>Alter</th>
                    )}
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                { participation.map((it, index) => (
                    <ParticipationListRow { ...({
                        key: index,
                        item: it,

                        studyType,
                        ageFrameField,
                        ageFrameFieldValue,
                        
                        studyRecordsById,
                        relatedRecordLabels,
                        relatedHelperSetItems,
                        relatedCustomRecordTypeLabels,
                        displayFieldData
                    }) } />
                ))}
            </tbody>
        </Table>
    )
}

const ParticipationListRow = ({
    item,

    studyType,
    ageFrameField,
    ageFrameFieldValue,
    studyRecordsById,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    displayFieldData
}) => {
    return (
        <tr>
            <FieldDataBodyCols { ...({
                record: studyRecordsById[item.studyId],
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,
                displayFieldData,
            })} />

            <td>{ 
                datefns.format(
                    new Date(item.timestamp),
                    'P p'
                )
            }</td>
            { ageFrameField && (
                <td>
                    { calculateAge({
                        base: ageFrameFieldValue,
                        relativeTo: item.timestamp
                    }) }
                </td>
            )}
            <td>
                { formatStatus(item.status) }
            </td>
            <td className='d-flex justify-content-end'>
                <StudyIconButton
                    to={`/studies/${studyType}/${item.studyId}`}
                />
            </td>
        </tr>
    );
}

var formatStatus = (status) => {
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

export default ParticipationList;
