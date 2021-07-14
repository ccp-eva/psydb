import React from 'react';
import { Button } from 'react-bootstrap';

import { FieldDataBodyCols } from '@mpieva/psydb-ui-lib/src/record-list';
import UpcomingExperiments from '../upcoming-experiments';

const TableBody = ({
    subjectData,
    subjectExperimentMetadata,

    onSelectSubject,
}) => {
    var { records, ...subjectMetadata } = subjectData;
    return (
        <tbody>
            { records.map((record, index) => {
                return (
                    <TableRow key={ index} { ...({
                        record,
                        subjectMetadata,
                        subjectExperimentMetadata,
                        onSelectSubject
                    }) }/>
                )
            })}
        </tbody>

    );
}

const TableRow = ({
    record,
    subjectMetadata,
    subjectExperimentMetadata,
    onSelectSubject
}) => {
    var isRed = (
        record._upcomingExperiments.length > 0
    );
    return (
        <tr
            key={record._id}
            className={ isRed ? 'bg-light-red' : '' }
        >

            <FieldDataBodyCols { ...({
                record,
                ...subjectMetadata
            }) }/>
            <td>
                { 
                    record.scientific.state
                        .internals.participatedInStudies
                        .filter(it => (
                            it.status === 'participated'
                        ))
                        .map(it => (
                            subjectMetadata
                            .relatedRecordLabels
                            .study[it.studyId]._recordLabel
                        ))
                        .join(', ')
                } 
            </td>
            <td>
                <UpcomingExperiments { ...({
                    records: record._upcomingExperiments,
                    ...subjectExperimentMetadata
                }) } />
            </td>
            <td>
                {
                    record._testableInStudies
                    .map(it => (
                        subjectMetadata.relatedRecordLabels
                        .study[it]._recordLabel
                    ))
                    .join(', ')
                }
            </td>
            <td>
                { !isRed && (
                    <div className='d-flex justify-content-end'>
                        <Button
                            size='sm'
                            onClick={ () => onSelectSubject({ record }) }
                        >
                            Termin
                        </Button>
                    </div>
                )}
            </td>
        </tr>
    )
}

export default TableBody
