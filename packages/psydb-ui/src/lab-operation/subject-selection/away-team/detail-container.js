import React from 'react';

import {
    Table,
    Button
} from 'react-bootstrap';

import {
    CheckSquareFill,
    Square
} from 'react-bootstrap-icons';

import {
    FieldDataHeadCols,
    FieldDataBodyCols,
} from '@mpieva/psydb-ui-lib/src/record-list';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import calculateAge from '@mpieva/psydb-ui-lib/src/calculate-age';
import Pair from '@mpieva/psydb-ui-lib/src/pair';
import CheckColumn from '@mpieva/psydb-ui-lib/src/check-column';

import UpcomingExperiments from '../upcoming-experiments';

const DetailContainer = ({
    locationId,
    locationComment,
    locationRecord,
    subjectRecords,
    subjectMetadata,
    subjectExperimentMetadata,

    onSelectSubject,
    onSelectManySubjects,
    selectedSubjectIds,

    onCreateExperiment
}) => {
    return (
        <div className='border bg-light pr-3 pl-3'>
            <Pair wLeft={ 2 } label='Kommentar: '>
                { locationComment || '-' }
            </Pair>
            <Table size='sm' className='border bg-white'>

                <thead>
                    <tr>
                        <th />
                        <FieldDataHeadCols { ...({
                            displayFieldData: subjectMetadata.displayFieldData
                        })}/>
                        <th>Alter</th>
                        <th>Teilg. Stud.</th>
                        <th>Termine</th>
                        <th>Kommentar</th>
                    </tr>
                </thead>

                <SubjectTableBody {...({
                    subjectRecords,
                    subjectMetadata,
                    subjectExperimentMetadata,

                    onSelectManySubjects: (records) => onSelectManySubjects({
                        locationId, subjectRecords: records,
                    }),
                    onSelectSubject: (record) => onSelectSubject({
                        locationId,
                        subjectRecord: record
                    }),
                    selectedSubjectIds,
                }) } />
            </Table>
            <div className='mt-3 mb-3'>
                <Button
                    size='sm'
                    disabled={ selectedSubjectIds.length < 1 }
                    onClick={ () => onCreateExperiment({ locationRecord }) }
                >
                    Termin eintragen
                </Button>
            </div>
        </div>
    );
}

const SubjectTableBody = ({
    subjectRecords,
    subjectMetadata,
    subjectExperimentMetadata,

    onSelectManySubjects,
    onSelectSubject,
    selectedSubjectIds,
}) => {
    return (
        <tbody>
            { subjectRecords.map(record => {
                var isRed = (
                    record._upcomingExperiments.length > 0
                );
                return (
                    <tr
                        key={record._id}
                        className={ isRed ? 'bg-light-red' : '' }
                    >

                        <CheckColumn { ...({
                            record,
                            selectedRecordIds: selectedSubjectIds,
                            onSelectRecord: onSelectSubject
                        })} />

                        <FieldDataBodyCols { ...({
                            record,
                            ...subjectMetadata
                        }) }/>
                        <td>
                            { calculateAge({
                                base: record._ageFrameField,
                                relativeTo: new Date(),
                            })}
                        </td>
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
                            { record.scientific.state.comment }
                        </td>
                    </tr>
                )
            })}
            <tr>
                <td
                    role='button'
                    onClick={ () => onSelectManySubjects(subjectRecords)}
                >
                    {
                        selectedSubjectIds.length > 0 
                        ? <CheckSquareFill />
                        : <Square />
                    }
                </td>
                <td 
                    colSpan={ subjectMetadata.displayFieldData.length + 4 }
                    style={{ color: '#006c66' }}
                >
                    Alle auswählen
                </td>
            </tr>
        </tbody>

    );
}


export default DetailContainer;
