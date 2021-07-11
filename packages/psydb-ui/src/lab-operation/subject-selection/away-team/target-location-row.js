import React from 'react';

import { CaretUpFill, CaretDownFill } from 'react-bootstrap-icons';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';

import {
    FieldDataBodyCols,
} from '@mpieva/psydb-ui-lib/src/record-list';

import UncollapseButton from './uncollapse-button';
import DetailContainer from './detail-container';

const TargetLocationRow = ({
    record,
    subjectMetadata,
    locationMetadata,
    experimentMetadata,

    onToggleDetails,
    selectedLocationId,

    onSelectSubject,
    onSelectManySubjects,
    selectedSubjectIds,

    onCreateExperiment
}) => {
    var colspan = locationMetadata.displayFieldData.length + 2;
    var showDetails = selectedLocationId === record._id;

    return (
        <>
            <tr>
                <FieldDataBodyCols { ...({
                    record,
                    ...locationMetadata,
                })} />
                <td>{ record._subjectRecords.length }</td>
                <td />
            </tr>
            <tr>
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
                                records: record._upcomingExperiments,
                                ...experimentMetadata
                            })} />
                        </div>
                        { showDetails&& (
                            <DetailContainer { ...({
                                locationId: record._id,
                                locationComment: record.state.comment,
                                locationRecord: record,
                                subjectRecords: record._subjectRecords,
                                subjectMetadata,

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
}) => {
    var upcoming = (
        records.length > 0
        ? (
            records.map((record) => {
                var start = datefns.format(record.state.interval.start, 'P');
                var study = relatedRecordLabels.study[record.state.studyId];
                return (
                    <b>
                        { start } - { study }
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
            Termine:
            {' '}
            { upcoming }
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
