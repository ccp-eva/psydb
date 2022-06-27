import React from 'react';

import { usePermissions } from '@mpieva/psydb-ui-hooks';
import {
    Button,
    EditIconButtonInline
} from '@mpieva/psydb-ui-layout';

import {
    formatDateInterval,
    SubjectTestableIntervals
} from '@mpieva/psydb-ui-lib';

import { FieldDataBodyCols } from '@mpieva/psydb-ui-lib/src/record-list';
//import UpcomingExperiments from '../upcoming-experiments';

const TableBody = ({
    inviteType,
    desiredTestInterval,

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
                        inviteType,
                        desiredTestInterval,

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
    inviteType,
    desiredTestInterval,

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
    var colspan = subjectMetadata.displayFieldData.length;
    return (
        <>
            <tr
                key={record._id}
                className={ isRed ? 'bg-light-red' : '' }
            >

                <FieldDataBodyCols { ...({
                    record,
                    ...subjectMetadata
                }) }/>
                <td></td>
            </tr>
            <ExtendedDataRow { ...({
                isRed,
                colspan,

                record,
                subjectMetadata,
                subjectExperimentMetadata,
                inviteType,
                desiredTestInterval,

                canWriteSubjects,

                onInviteSubject,
                onViewSubject
            })} />
        </>
    )
}

const ExtendedDataRow = (ps) => {
    var {
        isRed,
        colspan,

        record,
        subjectType,
        subjectMetadata,
        subjectExperimentMetadata,
        inviteType,
        desiredTestInterval,

        canWriteSubjects,

        onInviteSubject,
        onViewSubject
    } = ps;
    return (
        <tr>
            <td
                colSpan={ colspan }
                className={ (isRed ? 'bg-light-red' : '') + ' border-0 pt-0' }
            >
                <div className='d-flex justify-content-between'>
                    <Participation { ...({
                        record, subjectMetadata,
                        className: 'mr-4'
                    })} />
                    <UpcomingExperiments { ...({
                        inviteType,
                        records: record._upcomingExperiments,
                        ...subjectExperimentMetadata,
                        className: 'mr-4'
                    }) } />
                    <TestableInStudies { ...({
                        record, subjectMetadata, desiredTestInterval
                    })} />
                </div>
            </td>
            <td
                className={ (isRed ? 'bg-light-red' : '') + ' border-0 pt-0' }
            >
                <div>
                    <ActionButtons { ...({
                        isRed,

                        inviteType,
                        record,
                        subjectType,
                        desiredTestInterval,

                        canWriteSubjects,

                        onInviteSubject,
                        onViewSubject
                    }) } />
                </div>
            </td>
        </tr>
    );
}

const Participation = (ps) => {
    var { record, subjectMetadata, className } = ps;
    var { participatedInStudies } = record.scientific.state.internals;

    var filtered = (
        participatedInStudies
        .filter(it => (
            it.status === 'participated'
        ))
    );

    var formatted = (
        filtered.length > 0
        ? (
            filtered
            .map(it => (
                subjectMetadata
                .relatedRecordLabels
                .study[it.studyId]._recordLabel
            ))
            .join(', ')
        )
        : (
            <i className='text-muted'>Keine</i>
        )
    )

    return (
        <div className={ className + ' flex-grow-1 flex-basis-0' }>
            Teilg.Studien:
            {' '}
            { formatted }
        </div>
    );
}

// FIXME: redundant with away-team
const UpcomingExperiments = ({
    records,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,

    className,
}) => {
    var upcoming = (
        records.length > 0
        ? (
            records.map((record, ix) => {
                var { studyId, interval } = record.state;
                var { startDate } = formatDateInterval(interval);
                var study = relatedRecordLabels.study[studyId]._recordLabel;
                return (
                    <div>
                        <a 
                            key={ ix }
                            href={`#/experiments/${record.type}/${record._id}`}
                            className='d-inline-block mr-3'
                        >
                            { startDate } - { study }
                        </a>
                    </div>
                );
            })
        )
        : (
            <i className='text-muted'>Keine</i>
        )
    )
    return (
        <div className={ className + ' d-flex flex-grow-1 flex-basis-0' }>
            Termine:
            <div className='ml-3'>
                { upcoming }
            </div>
        </div>
    )
}
const TestableInStudies = (ps) => {
    var { record, subjectMetadata, desiredTestInterval } = ps;
    var formatted = (
        record._testableInStudies
        .map((studyId, ix) => {
            var studyLabel = (
                subjectMetadata.relatedRecordLabels
                .study[studyId]._recordLabel
            );
            var testableIntervals = (
                record[`_testableIntervals_${studyId}`]
            );

            return (
                <SubjectTestableIntervals
                    key={ ix }
                    studyLabel={ studyLabel }
                    desiredTestInterval={ desiredTestInterval }
                    testableIntervals={ testableIntervals }
                />
            )
        })
    )
    return (
        <div className='d-flex mr-4 flex-grow-1 flex-basis-0'>
            <b>Mögl.Studien:</b>
            <div className='ml-3'>
                { formatted }
            </div>
        </div>
    );
}

const ActionButtons = (ps) => {
    var {
        isRed,

        inviteType,
        record,
        subjectType,
        desiredTestInterval,

        canWriteSubjects,

        onInviteSubject,
        onViewSubject
    } = ps;

    return (
        <>
            { !isRed && (
                <div className='d-flex justify-content-end'>
                    <Button
                        size='sm'
                        onClick={ () => onInviteSubject({
                            inviteType,
                            record,
                            desiredTestInterval,
                            testableInStudies: (
                                record // FIXME
                            )
                        }) }
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
        </>
    );
}

export default TableBody
