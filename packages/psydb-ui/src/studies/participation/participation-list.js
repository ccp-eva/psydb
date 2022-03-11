import React, { useEffect, useReducer, useMemo } from 'react';
import jsonpointer from 'jsonpointer';
import {
    Table,
    DetailsIconButton,
} from '@mpieva/psydb-ui-layout';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import calculateAge from '@mpieva/psydb-ui-lib/src/calculate-age';

import FieldDataHeadCols from '@mpieva/psydb-ui-lib/src/record-list/field-data-head-cols';
import FieldDataBodyCols from '@mpieva/psydb-ui-lib/src/record-list/field-data-body-cols';

const ParticipationList = ({
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
                    <th>Zeitpunkt</th>
                    { dateOfBirthField && (
                        <th>Alter</th>
                    )}
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                { records.map((it, index) => (
                    <ParticipationListRow { ...({
                        key: index,
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

const ParticipationListRow = ({
    record,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    displayFieldData,
    dateOfBirthField,
}) => {

    var participationData = (
        record.scientific.state.internals.participatedInStudies[0]
    );

    var date = new Date(participationData.timestamp);
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
                record,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,
                displayFieldData,
            })} />
            <td>{ is1970 ? '-' : formattedDate }</td>
            { dateOfBirthField && (
                <td>
                    { 
                        is1970
                        ? '-'
                        : calculateAge({
                            base: jsonpointer.get(
                                record, dateOfBirthField.dataPointer
                            ),
                            relativeTo: participationData.timestamp
                        })
                    }
                </td>
            )}
            <td>
                { formatStatus(participationData.status) }
            </td>
            <td className='d-flex justify-content-end'>
                <DetailsIconButton
                    to={`/subjects/${record.type}/${record._id}`}
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
