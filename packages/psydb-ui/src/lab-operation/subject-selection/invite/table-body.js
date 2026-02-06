import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import {
    Button,
    EditIconButtonInline
} from '@mpieva/psydb-ui-layout';

import { TableBodyCustomCols } from '@mpieva/psydb-custom-fields-ui';

import {
    formatDateInterval,
    SubjectTestableIntervals,
} from '@mpieva/psydb-ui-lib';
import calculateAge from '@mpieva/psydb-ui-lib/src/calculate-age';

//import UpcomingExperiments from '../upcoming-experiments';

const TableBody = (ps) => {
    var {
        inviteType,
        desiredTestInterval,

        subjectType,
        subjectData,
        subjectExperimentMetadata,

        onInviteSubject,
        onViewSubject,
    } = ps;

    var { records, ...subjectMetadata } = subjectData;
    var { definitions, related } = subjectMetadata;

    var permissions = usePermissions();
    var canWriteSubjects = permissions.hasFlag('canWriteSubjects');

    return (
        <tbody>
            { records.map((record, index) => {
                return (
                    <TableRow key={ index} { ...({
                        index,
                        inviteType,
                        desiredTestInterval,

                        subjectType,
                        record,
                        subjectMetadata,
                        subjectExperimentMetadata,
                        
                        related,
                        definitions,

                        canWriteSubjects,

                        onInviteSubject,
                        onViewSubject
                    }) }/>
                )
            })}
        </tbody>

    );
}

const TableRow = (ps) => {
    var {
        inviteType,
        desiredTestInterval,

        index,
        subjectType,
        
        record,
        related,
        definitions,

        subjectMetadata,
        subjectExperimentMetadata,

        canWriteSubjects,

        onInviteSubject,
        onViewSubject
    } = ps;

    var isRed = (
        record._upcomingExperiments.length > 0
    );
    var colspan = subjectMetadata.displayFieldData.length;
    var isEven = (index % 2) === 0;
    var className = (
        isRed
        ? ( isEven ? 'bg-medium-red' : 'bg-light-red' )
        : ( isEven ? 'bg-light' : '' )
    );
    return (
        <>
            <tr className={ className } >
                <td>{ record._recordLabel }</td>
                <TableBodyCustomCols
                    record={ record }
                    definitions={ definitions }
                    related={ related }
                />
                <td>
                    { calculateAge({
                        base: record._ageFrameField,
                        relativeTo: new Date(),
                    })}
                </td>
                <td>
                    <Participation { ...({
                        record, subjectMetadata,
                        className: 'mr-4'
                    })} />
                </td>
                <td>
                    <UpcomingExperiments { ...({
                        inviteType,
                        records: record._upcomingExperiments,
                        ...subjectExperimentMetadata,
                        className: 'mr-4'
                    }) } />
                </td>
                <td>
                    <TestableInStudies { ...({
                        record, subjectMetadata, desiredTestInterval
                    })} />
                </td>
                <td>
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
                </td>
            </tr>
            {/*<ExtendedDataRow { ...({
                isRed,
                className,
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
            })} />*/}
        </>
    )
}

const ExtendedDataRow = (ps) => {
    var {
        isRed,
        className,
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
        <tr className={ className }>
            <td
                colSpan={ colspan }
                className={ 'border-0 pt-0' }
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
                className={ 'border-0 pt-0' }
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

    var [{ translate }] = useI18N();

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
            .map((it, ix) => (
                <div key={ ix }> {
                    subjectMetadata
                    .relatedRecordLabels
                    .study[it.studyId]._recordLabel
                } </div>
            ))
        )
        : (
            <i className='text-muted'>{ translate('None') }</i>
        )
    )

    return formatted;

    //return (
    //    <div className={ className + ' flex-grow-1 flex-basis-0' }>
    //        <b>Teilg.Studien:</b>
    //        {' '}
    //        { formatted }
    //    </div>
    //);
}

// FIXME: redundant with away-team
const UpcomingExperiments = (ps) => {
    var {
        records,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,

        className,
    } = ps;

    var [{ translate, locale }] = useI18N();

    var upcoming = (
        records.length > 0
        ? (
            records.map((record, ix) => {
                var { studyId, interval } = record.state;
                var { startDate } = formatDateInterval(interval, { locale });
                var study = relatedRecordLabels.study[studyId]._recordLabel;
                return (
                    <div key={ ix }>
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
            <i className='text-muted'>{ translate('None') }</i>
        )
    )

    return upcoming;

    //return (
    //    <div className={ className + ' d-flex flex-grow-1 flex-basis-0' }>
    //        <b>Termine:</b>
    //        <div className='ml-3'>
    //            { upcoming }
    //        </div>
    //    </div>
    //)
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
    );

    return formatted;

    //return (
    //    <div className='d-flex mr-4 flex-grow-1 flex-basis-0'>
    //        <b>Mögl.Studien:</b>
    //        <div className='ml-3'>
    //            { formatted }
    //        </div>
    //    </div>
    //);
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
   
    var [{ translate }] = useI18N();

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
                        { translate('Appointment') }
                    </Button>
                </div>
            )}
            { isRed && canWriteSubjects && (
                <div className='d-flex justify-content-end'>
                    <EditIconButtonInline
                        buttonStyle={{ background: 'transparent' }}
                        onClick={ () => onViewSubject({
                            title: `${translate('Subject')} - ${record._recordLabel}`,
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
