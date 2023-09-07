import React from 'react';

import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';

import {
    Table,
    TableHeadCustomCols,
    Button,
    Pair,
    Icons,
    SplitPartitioned,
    EditIconButtonInline,
} from '@mpieva/psydb-ui-layout';

import {
    FieldDataBodyCols,
} from '@mpieva/psydb-ui-lib/src/record-list';

import { calculateAge } from '@mpieva/psydb-common-lib';
import { datefns } from '@mpieva/psydb-ui-lib';

import CheckColumn from '@mpieva/psydb-ui-lib/src/check-column';

import UpcomingExperiments from '../upcoming-experiments';

const DetailContainer = (ps) => {
    var {
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
    } = ps;

    var translate = useUITranslation();

    return (
        <div className='border bg-light pr-3 pl-3'>
            <div className='py-2'>
                <SplitPartitioned partitions={[ 2, 10 ]}>
                    <div className='py-2'>
                        { translate('Location Comment') }
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
                            : <i>{ translate('Not Specified') }</i>
                        }
                    </div>
                </SplitPartitioned>
            </div>
            <Table size='sm' className='border bg-white'>

                <thead>
                    <tr>
                        <th />
                        <th>{ translate('Subject') }</th>
                        <TableHeadCustomCols { ...({
                            definitions: subjectMetadata.displayFieldData
                        })}/>
                        <th>{ translate('Age Today') }</th>
                        <th>{ translate('Part. Studies') }</th>
                        <th>{ translate('Appointments') }</th>
                        <th>{ translate('Comment') }</th>
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
                    { translate('Create Appointment') }
                </Button>
            </div>
        </div>
    );
}

const SubjectTableBody = (ps) => {
    var {
        studyIds,
        subjectRecords,
        subjectMetadata,
        subjectExperimentMetadata,

        onSelectManySubjects,
        onSelectSubject,
        selectedSubjectIds,
    } = ps;

    var translate = useUITranslation();

    var quickSelectSubjects = (
        subjectRecords
        .filter((record) => (
            record._upcomingExperiments.filter(it => (
                studyIds.includes(it.state.studyId)
            )).length === 0
        ))
    );

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
                    className='user-select-none'
                    role='button'
                    onClick={ () => {
                        onSelectManySubjects(quickSelectSubjects)
                    }}
                >
                    {(
                        selectedSubjectIds.length 
                        === quickSelectSubjects.length
                    ) ? (
                        <Icons.CheckSquareFill />
                    ) : (
                        <Icons.Square />
                    )}
                </td>
                <td
                    className='user-select-none'
                    colSpan={ subjectMetadata.displayFieldData.length + 4 }
                    style={{ color: '#006c66' }}
                    role='button'
                    onClick={ () => {
                        onSelectManySubjects(quickSelectSubjects)
                    }}
                >
                    <b>{(
                        selectedSubjectIds.length 
                        === quickSelectSubjects.length
                    ) ? (
                        translate('Deselect All')
                    ) : (
                        translate('Select All')
                    )}</b>
                </td>
            </tr>
        </tbody>

    );
}


export default DetailContainer;
