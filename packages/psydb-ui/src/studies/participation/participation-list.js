import React, { useEffect, useReducer, useMemo } from 'react';
import jsonpointer from 'jsonpointer';
import { Table } from 'react-bootstrap';

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

    return (
        <tr>
            <FieldDataBodyCols { ...({
                record,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,
                displayFieldData,
            })} />
            <td>{ 
                datefns.format(
                    new Date(participationData.timestamp),
                    'P p'
                )
            }</td>
            { dateOfBirthField && (
                <td>
                    { 
                        // FIXME: timezone correction
                        // PS: calculating the difference
                        // between a tz corrected value and actual
                        // date-time is hillarious
                        // NOTE: maybe we could strip the time from
                        // the participation timestamp
                        calculateAge({
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
