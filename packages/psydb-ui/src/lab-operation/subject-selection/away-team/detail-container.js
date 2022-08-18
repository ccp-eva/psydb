import React from 'react';

import {
    Table,
    Button,
    Pair,
    Icons,
    SplitPartitioned,
    EditIconButtonInline,
} from '@mpieva/psydb-ui-layout';

import {
    FieldDataHeadCols,
    FieldDataBodyCols,
} from '@mpieva/psydb-ui-lib/src/record-list';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import calculateAge from '@mpieva/psydb-ui-lib/src/calculate-age';

import CheckColumn from '@mpieva/psydb-ui-lib/src/check-column';

import UpcomingExperiments from '../upcoming-experiments';

const DetailContainer = ({
    studyIds,
    locationId,
    locationComment,
    locationRecord,
    subjectRecords,
    subjectMetadata,
    subjectExperimentMetadata,

    onEditLocationComment,
    onSelectSubject,
    onSelectManySubjects,
    selectedSubjectIds,

    onCreateExperiment
}) => {
    return (
        <div className='border bg-light pr-3 pl-3'>
            <div className='py-2'>
                <SplitPartitioned partitions={[ 2, 10 ]}>
                    <div className='py-2'>
                        Location Kommentar
                        {' '}
                        <EditIconButtonInline
                            onClick={ () => (
                                onEditLocationComment({
                                    locationLabel: locationRecord._recordLabel,
                                    locationId,
                                    locationComment
                                })
                            )}
                        />
                    </div>
                    <div className='px-3 py-2 border bg-white'>
                        {
                            locationComment
                            ? <b style={{ fontWeight: 600 }}>
                                { locationComment }
                            </b>
                            : <i>Keine Angabe</i>
                        }
                    </div>
                </SplitPartitioned>
            </div>
            <Table size='sm' className='border bg-white'>

                <thead>
                    <tr>
                        <th />
                        <th>Proband:in</th>
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
                    studyIds,
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
    studyIds,
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
                var canSelect = record._upcomingExperiments.filter(it => (
                    studyIds.includes(it.state.studyId)
                )).length === 0;

                var isRed = (
                    record._upcomingExperiments.length > 0
                );
                return (
                    <tr
                        key={record._id}
                        className={ isRed ? 'bg-light-red' : '' }
                    >
                        
                        {
                            canSelect
                            ? <CheckColumn { ...({
                                record,
                                selectedRecordIds: selectedSubjectIds,
                                onSelectRecord: onSelectSubject
                            })} />
                            : <td></td>
                        }

                        <td>
                            <a
                                target='_blank'
                                href={`#/subjects/${record.type}/${record._id}`}
                            >
                                { record._recordLabel }
                            </a>
                        </td>
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
                    onClick={ () => {
                        var filtered = (
                            subjectRecords.filter((record) => (
                                record._upcomingExperiments.filter(it => (
                                    studyIds.includes(it.state.studyId)
                                )).length === 0
                            ))
                        );
                        onSelectManySubjects(filtered)
                    }}
                >
                    {
                        selectedSubjectIds.length > 0 
                        ? <Icons.CheckSquareFill />
                        : <Icons.Square />
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
