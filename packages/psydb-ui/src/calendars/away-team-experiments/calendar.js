import React, { useMemo } from 'react';

import {
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { ArrowLeftShort } from 'react-bootstrap-icons';

import { useURLSearchParams } from '@cdxoo/react-router-url-search-params';
import omit from '@cdxoo/omit';

import useFetch from '@mpieva/psydb-ui-lib/src/use-fetch';
import useRevision from '@mpieva/psydb-ui-lib/src/use-revision';

import getDayStartsInInterval from '@mpieva/psydb-ui-lib/src/get-day-starts-in-interval';

import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';
import LinkButton from '@mpieva/psydb-ui-lib/src/link-button';
import withWeeklyCalendarPages from '@mpieva/psydb-ui-lib/src/with-weekly-calendar-pages';
import CalendarNav from '@mpieva/psydb-ui-lib/src/calendar-nav';

import DaysHeader from './days-header';
import StudyRow from './study-row';

const headerStyle = {
    marginLeft: '35px',
}

const AwayTeamCalendar = ({
    currentPageStart,
    currentPageEnd,
    onPageChange,
}) => {
    var { path, url } = useRouteMatch();
    var {
        locationType,
        researchGroupId,
    } = useParams();

    var [ revision, increaseRevision ] = useRevision();
    var [ query, updateQuery ] = useURLSearchParams();
    // TODO: study selection
    
    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.fetchLocationExperimentCalendar({
            //experimentType: 'away-team',
            locationType,
            researchGroupId,
            
            interval: {
                start: currentPageStart,
                end: currentPageEnd,
            },
        });
    }, [ currentPageStart, currentPageEnd, revision ])

    var allDayStarts = useMemo(() => (
        getDayStartsInInterval({
            start: currentPageStart,
            end: currentPageEnd
        })
    ), [ currentPageStart, currentPageEnd ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        experimentRecords,
        experimentRelated,

        reservationRecords,
        reservationRelated,

        experimentOperatorTeamRecords,
        
        locationRecordsById,
        locationRelated,
        locationDisplayFieldData,

        studyRecordLabels,
    } = fetched.data;

    return (
        <div>
            <div className='bg-light'>
                <LinkButton to={ `/calendars/away-team/${ locationType }` }>
                    <ArrowLeftShort style={{
                        height: '25px',
                        width: '25px',
                        merginLeft: '-10px',
                        marginTop: '-3px',
                    }} />
                    Zurück
                </LinkButton>
            </div>

            <CalendarNav { ...({
                className: 'mt-3 mr-5 ml-5',
                currentPageStart,
                currentPageEnd,
                onPageChange,
            })} />

            <hr className='mt-1 mb-3' style={{
                marginLeft: '15em',
                marginRight: '15em',
            }}/>

            <DaysHeader { ...({
                allDayStarts,
                style: headerStyle,
            }) } />
    
            { studyRecordLabels.map(it => (
                <StudyRow key={ it._id } { ...({
                    allDayStarts,

                    studyId: it._id,
                    studyLabel: it._recordLabel,
                    experimentRecords,
                    reservationRecords,
                    
                    experimentRelated,
                    reservationRelated,
                    experimentOperatorTeamRecords,
                    locationRecordsById,
                    locationRelated,
                    locationDisplayFieldData,
                    
                    url,
                    onSuccessfulUpdate: increaseRevision
                }) } />
            ))}

        </div>
    )
}

const WrappedAwayTeamCalendar = (
    withWeeklyCalendarPages(AwayTeamCalendar, { withURLSearchParams: true })
);

export default WrappedAwayTeamCalendar;
