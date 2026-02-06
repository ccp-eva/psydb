import React from 'react';

import { entries } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { datefns, formatDateInterval } from '@mpieva/psydb-ui-lib';

import { TableBodyCustomCols } from '@mpieva/psydb-custom-fields-ui';

import UncollapseButton from './uncollapse-button';
import DetailContainer from './detail-container';

const TargetLocationRow = (ps) => {
    var {
        studyIds,
        record,
        subjectMetadata,
        subjectExperimentMetadata,
        locationMetadata,
        locationExperimentMetadata,

        onToggleDetails,
        selectedLocationId,

        onEditLocationComment,
        onSelectSubject,
        onSelectManySubjects,
        selectedSubjectIds,

        onCreateExperiment
    } = ps;

    var { related, definitions } = locationMetadata;
    var colspan = definitions.length + 2;
    var showDetails = selectedLocationId === record._id;

    var isRed = (
        record._upcomingExperiments.length > 0
    );

    return (
        <>
            <tr className={ isRed ? 'bg-light-red' : '' }>
                <TableBodyCustomCols
                    record={ record }
                    definitions={ definitions }
                    related={ related }
                />
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
                                studyIds,
                                locationId: record._id,
                                locationComment: record.state.comment,
                                locationRecord: record,
                                subjectRecords: record._subjectRecords,
                                subjectMetadata,
                                subjectExperimentMetadata,

                                onEditLocationComment,
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

// FIXME: redundant with invite
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
                    <b key={ ix } className='d-inline-block mr-3'>
                        { startDate } - { study }
                    </b>
                );
            })
        )
        : (
            <i className='text-muted'>
                { translate('None') }
            </i>
        )
    )
    return (
        <div className={ className }>
            { translate('Appointments') }
            {': '}
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

    var [{ translate, locale }] = useI18N();

    var past = (
        records.length > 0
        ? (
            records.map((record, ix) => {
                var { studyId, interval } = record.state;
                var { startDate } = formatDateInterval(interval, { locale });
                var study = relatedRecordLabels.study[studyId]._recordLabel;
                return (
                    <b key={ ix } className='d-inline-block mr-3'>
                        { startDate } - { study }
                    </b>
                );
            })
        )
        : (
            <i className='text-muted'>
                { translate('None') }
            </i>
        )
    )
    
    return (
        <div>
            { translate('Studies') }
            {': '}
            { past }
        </div>
    )
}

const ExcludedWeekdays = (ps) => {
    var { excluded } = ps;

    var [{ translate, locale }] = useI18N();

    var dayLabels = (
        entries([ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun' ])
        .reduce((acc, [ ix, day ]) => ({
            ...acc,
            [day]: locale.localize.day(ix + 1, { width: 'short' })
        }), {})
    );

    var labels = Object.keys(excluded).reduce((acc, key) => [
        ...acc, ...( excluded[key] === true ? [ dayLabels[key] ] : [] )
    ], [])

    return (
        labels.length > 0
        ? (
            <div className='mr-5'>
                { translate('_not_at_weekday') }
                {': '}
                <b>{ labels.join(', ') }</b>
            </div>
        )
        : null
    );
}

export default TargetLocationRow;
