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
    var date = new Date(item.timestamp);
    var formattedDate = datefns.format(
        date,
        'dd.MM.yyyy HH:mm'
    );
    // FIXME: this is really hacky but we have
    // experiments old stuff in db
    var is1970 = (
        date.toISOString() === '1970-01-01T00:00:00.000Z'
        //formattedDate === '01.01.1970 00:00'
    );

    return (
        <tr>
            <FieldDataBodyCols { ...({
                record: studyRecordsById[item.studyId],
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,
                displayFieldData,
            })} />

            <td>{ is1970 ? '-' : formattedDate }</td>
            { ageFrameField && (
                <td>
                    { 
                        is1970
                        ? '-'
                        : calculateAge({
                            base: ageFrameFieldValue,
                            relativeTo: item.timestamp
                        })
                    }
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
        'did-show-up': 'gek.',
        'didnt-show-up': 'n. gek.',
        'canceled-by-participant': 'abg.',
        'canceled-by-institute': 'ausg.',
    }[status] || 'ERROR'
}

export default ParticipationList;
