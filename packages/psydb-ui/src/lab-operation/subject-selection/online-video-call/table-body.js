import React from 'react';

import { usePermissions } from '@mpieva/psydb-ui-hooks';
import {
    Button,
    EditIconButtonInline
} from '@mpieva/psydb-ui-layout';

import { FieldDataBodyCols } from '@mpieva/psydb-ui-lib/src/record-list';
import UpcomingExperiments from '../upcoming-experiments';

const TableBody = ({
    subjectType,
    subjectData,
    subjectExperimentMetadata,

    onInviteSubject,
    onViewSubject,
}) => {
    var { records, ...subjectMetadata } = subjectData;

    var permissions = usePermissions();
    var canWriteSubjects = permissions.hasFlag('canWriteSubjects');

    return (
        <tbody>
            { records.map((record, index) => {
                return (
                    <TableRow key={ index} { ...({
                        subjectType,
                        record,
                        subjectMetadata,
                        subjectExperimentMetadata,
                        
                        canWriteSubjects,

                        onInviteSubject,
                        onViewSubject
                    }) }/>
                )
            })}
        </tbody>

    );
}

const TableRow = ({
    subjectType,
    record,
    subjectMetadata,
    subjectExperimentMetadata,

    canWriteSubjects,

    onInviteSubject,
    onViewSubject
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
                            onClick={ () => onInviteSubject({ record }) }
                        >
                            Termin
                        </Button>
                    </div>
                )}
                { isRed && canWriteSubjects && (
                    <div className='d-flex justify-content-end'>
                        <EditIconButtonInline
                            buttonStyle={{ background: 'transparent' }}
                            onClick={ () => onViewSubject({
                                title: `Proband:in - ${record._recordLabel}`,
                                subjectId: record._id,
                                subjectType
                            })}
                        />
                    </div>
                )}
            </td>
        </tr>
    )
}

export default TableBody
