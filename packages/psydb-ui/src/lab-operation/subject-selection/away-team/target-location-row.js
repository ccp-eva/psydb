import React from 'react';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import { formatDateInterval } from '@mpieva/psydb-ui-lib';

import {
    FieldDataBodyCols,
} from '@mpieva/psydb-ui-lib/src/record-list';

import UncollapseButton from './uncollapse-button';
import DetailContainer from './detail-container';

const TargetLocationRow = ({
    record,
    subjectMetadata,
    subjectExperimentMetadata,
    locationMetadata,
    locationExperimentMetadata,

    onToggleDetails,
    selectedLocationId,

    onSelectSubject,
    onSelectManySubjects,
    selectedSubjectIds,

    onCreateExperiment
}) => {
    var colspan = locationMetadata.displayFieldData.length + 2;
    var showDetails = selectedLocationId === record._id;

    var isRed = (
        record._upcomingExperiments.length > 0
    );

    return (
        <>
            <tr
                className={ isRed ? 'bg-light-red' : '' }
            >
                <FieldDataBodyCols { ...({
                    record,
                    ...locationMetadata,
                })} />
                <td>{ record._subjectRecords.length }</td>
                <td />
            </tr>
            <tr
                className={ isRed ? 'bg-light-red' : '' }
            >
                <td colSpan={ colspan } className='border-0 pt-0'>
                    <div className=''>
                        <div className='d-flex'>
                            <div className='pr-5'>
                                <UncollapseButton
                                    onClick={ () => onToggleDetails({
                                        locationId: record._id
                                    })}
                                    direction={ showDetails ? 'up': 'down' }
                                />
                            </div>

                            <ExcludedWeekdays {...({
                                excluded: record.state.reservationSettings.excludedExperimentWeekdays
                            })} />
                            <UpcomingExperiments { ...({
                                className: 'mr-5',
                                records: record._upcomingExperiments,
                                ...locationExperimentMetadata
                            })} />
                            <PastStudies { ...({
                                records: record._pastStudies,
                                ...locationExperimentMetadata
                            }) } />
                        </div>
                        { showDetails && (
                            <DetailContainer { ...({
                                locationId: record._id,
                                locationComment: record.state.comment,
                                locationRecord: record,
                                subjectRecords: record._subjectRecords,
                                subjectMetadata,
                                subjectExperimentMetadata,

                                onSelectSubject,
                                onSelectManySubjects,
                                selectedSubjectIds,
                                
                                onCreateExperiment,
                            }) }/>
                        )}
                    </div>
                </td>
            </tr>
        </>
    );    
}

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
                    <b key={ ix } className='d-inline-block mr-3'>
                        { startDate } - { study }
                    </b>
                );
            })
        )
        : (
            <i className='text-muted'>Keine</i>
        )
    )
    return (
        <div className={ className }>
            Termine:
            {' '}
            { upcoming }
        </div>
    )
}

const PastStudies = (ps) => {
    var {
        records = [],
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
    } = ps;

    var past = (
        records.length > 0
        ? (
            records.map((record, ix) => {
                var { studyId, interval } = record.state;
                var { startDate } = formatDateInterval(interval);
                var study = relatedRecordLabels.study[studyId]._recordLabel;
                return (
                    <b key={ ix } className='d-inline-block mr-3'>
                        { startDate } - { study }
                    </b>
                );
            })
        )
        : (
            <i className='text-muted'>Keine</i>
        )
    )
    
    return (
        <div>
            Studien:
            {' '}
            { past }
        </div>
    )
}

// FIXME: localization
const dayLabels = {
    mon: 'Mo',
    tue: 'Di',
    wed: 'Mi',
    thu: 'Do',
    fri: 'Fr',
    sat: 'Sa',
    sun: 'So',
};

const ExcludedWeekdays = ({
    excluded
}) => {
    var labels = Object.keys(excluded).reduce((acc, key) => [
        ...acc, ...( excluded[key] === true ? [ dayLabels[key] ] : [] )
    ], [])
    return (
        labels.length > 0
        ? <div className='mr-5'>nicht am: <b>{ labels.join(', ') }</b></div>
        : null
    );
}

export default TargetLocationRow;
