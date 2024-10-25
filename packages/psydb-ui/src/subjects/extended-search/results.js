import React from 'react';
import { __fixDefinitions, __fixRelated } from '@mpieva/psydb-common-compat';
import { getSystemTimezone } from '@mpieva/psydb-timezone-helpers';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import {
    useFetch,
    usePaginationURLSearchParams,
} from '@mpieva/psydb-ui-hooks';

import {
    Table as BSTable,
    Alert,
    LoadingIndicator,
    SubjectIconButton,
    LinkContainer,
} from '@mpieva/psydb-ui-layout';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns'

import {
    TableHeadCustomCols,
    TableBodyCustomCols,
} from '@mpieva/psydb-custom-fields-ui';

import {
    TableFNs,
    prepareSelectedColumnDefinitions
} from '@mpieva/psydb-ui-lib/src/extended-record-list'

import sanitizeFormData from './sanitize-form-data';

export const Results = (ps) => {
    var { schema, crtSettings, formData } = ps;
    var { fieldDefinitions } = crtSettings;
    var { columns } = formData;
    
    var saneData = sanitizeFormData(fieldDefinitions, formData);

    var pagination = usePaginationURLSearchParams({ offset: 0, limit: 50 })
    var { offset, limit } = pagination;
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetch(`/subject/extendedSearch`, {
            ...saneData, offset, limit, timezone: getSystemTimezone(),
        }).then((response) => {
            pagination.setTotal(response.data.data.recordsCount);
            return response;
        })
    ), [ offset, limit ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records, related, displayFieldData } = fetched.data;
    var definitions = __fixDefinitions(displayFieldData);
    related = __fixRelated(related, { isResponse: false });

    var selectedColumnDefinitions = prepareSelectedColumnDefinitions({
        columns, definitions
    });

    return (
        <div>
            <TableFNs
                collection='subject'
                pagination={ pagination }
                formData={ saneData }
            />
            { records.length > 0 ? (
                <Table
                    definitions={ selectedColumnDefinitions }
                    records={ records }
                    related={ related }
                    columns={ columns } // FIXME special cols
                />
            ) : (
                <TableFallback
                    definitions={ selectedColumnDefinitions }
                    columns={ columns } // FIXME special cols
                />
            )}
        </div>
    )
}


const TableFallback = (ps) => {
    var translate = useUITranslation();
    return (
        <>
            <BSTable>
                <TableHead { ...ps } />
            </BSTable>
            <Alert variant='info'>
                <i>{ translate('No Records found.') }</i>
            </Alert>
        </>
    )
}

const Table = (ps) => {
    return (
        <BSTable>
            <TableHead { ...ps } />
            <TableBody { ...ps } />
        </BSTable>
    );
}

const TableHead = (ps) => {
    var { columns, definitions } = ps;
    var translate = useUITranslation();
    return (
        <thead><tr>
            <TableHeadCustomCols definitions={ definitions } />
            { columns.includes('/_specialAgeToday') && (
                <th>{ translate('Age Today') }</th>
            )}
            { columns.includes('/_specialStudyParticipation') && (
                <th>{ translate('Studies') }</th>
            )}
            { columns.includes('/_specialUpcomingExperiments') && (
                <th>{ translate('Appointments') }</th>
            )}
            { columns.includes('/_specialHistoricExperimentLocations') && (
                <th>{ translate('Historical Appointment Locations') }</th>
            )}
            <th></th>
        </tr></thead>
    )
}

const TableBody = (ps) => {
    var { columns, definitions, records, related } = ps;

    return (
        <tbody>
            { records.map(it => (
                <tr
                    key={ it._id }
                    className={ it._isHidden ? 'bg-light text-grey' : '' }
                >
                    <TableBodyCustomCols
                        record={ it }
                        related={ related }
                        definitions={ definitions }
                    />
                    { columns.includes('/_specialAgeToday') && (
                        <td>{ it._specialAgeToday }</td>
                    )}
                    { columns.includes('/_specialStudyParticipation') && (
                        <ParticipationColumn
                            participation={
                                it
                                .scientific.state
                                .internals.participatedInStudies
                            }
                            related={ related }
                        />
                    )}
                    { columns.includes('/_specialHistoricExperimentLocations') && (
                        <HistoricExperimentLocationsColumn
                            participation={
                                it
                                .scientific.state
                                .internals.participatedInStudies
                            }
                            related={ related }
                        />
                    )}
                    { columns.includes('/_specialUpcomingExperiments') && (
                        <ExperimentColumn
                            experiments={ it._specialUpcomingExperiments }
                        />
                    )}
                    <td>
                        <div className='d-flex justify-content-end'>
                            <SubjectIconButton
                                to={`/subjects/${it.type}/${it._id}`}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    )
}

const ParticipationColumn = (ps) => {
    var { participation, related } = ps;
    return (
        <td>{
            participation
            .filter(it => it.status === 'participated')
            .map(it => {
                var { studyId, timestamp } = it;
                var date = datefns.format(new Date(timestamp), 'dd.MM.yyyy');
                var label = (
                    related.records.study?.[studyId]?._recordLabel
                    || studyId
                );

                return `${label} (${date})`;
            })
            .join('; ')
        }</td>
    )
}

const HistoricExperimentLocationsColumn = (ps) => {
    var { participation, related } = ps;
    return (
        <td>{
            participation
            .filter(it => it.status === 'participated')
            .map(it => {
                var { locationId, timestamp } = it;
                var date = datefns.format(new Date(timestamp), 'dd.MM.yyyy');
                var label = (
                    related.records.location?.[locationId]?._recordLabel
                    || locationId
                );
                return `${label} (${date})`;
            })
            .join('; ')
        }</td>
    )
}
const ExperimentColumn = (ps) => {
    var { experiments, related } = ps;
    var items = experiments.map((it, ix) => {
        var date = datefns.format(
            new Date(it.state.interval.start), 'dd.MM.yyyy'
        );
        return (
            <LinkContainer
                key={ ix }
                to={ `/experiments/${it.type}/${it._id}` }
            >
                <a>{ it.state.studyLabel } ({date})</a>
            </LinkContainer>
        );
    });
    return (
        <td>
            { items.map((it, ix) => (
                <div key={ ix }>{ it }</div>
            ))}
        </td>
    )
}
