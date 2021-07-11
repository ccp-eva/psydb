import React from 'react';

import {
    Table
} from 'react-bootstrap';

import {
    FieldDataHeadCols,
    FieldDataBodyCols,
} from '@mpieva/psydb-ui-lib/src/record-list';

import calculateAge from '@mpieva/psydb-ui-lib/src/calculate-age';
import Pair from '@mpieva/psydb-ui-lib/src/pair';
import CheckColumn from '@mpieva/psydb-ui-lib/src/check-column';


const DetailContainer = ({
    locationId,
    locationComment,
    subjectRecords,
    subjectMetadata,

    onSelectSubject,
    onSelectManySubjects,
    selectedSubjectIds
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

                    onSelectSubject: (record) => onSelectSubject({
                        locationId,
                        subjectRecord: record
                    }),
                    selectedSubjectIds,
                }) } />
            </Table>
        </div>
    );
}

const SubjectTableBody = ({
    subjectRecords,
    subjectMetadata,

    onSelectSubject,
    selectedSubjectIds,
}) => {
    return (
        <tbody>
            { subjectRecords.map(record => {
                return (
                    <tr key={record._id}>

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
                            TODO
                        </td>
                        <td>
                            { record.scientific.state.comment }
                        </td>
                    </tr>
                )
            })}
        </tbody>

    );
}

export default DetailContainer;
