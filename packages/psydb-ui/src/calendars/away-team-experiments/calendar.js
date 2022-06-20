import React, { useState, useMemo } from 'react';

import {
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import {
    useFetch,
    useRevision,
    usePermissions,
    useURLSearchParams,
} from '@mpieva/psydb-ui-hooks';

import {
    Button,
    LoadingIndicator,
    LinkButton,
    Icons,
} from '@mpieva/psydb-ui-layout';

import omit from '@cdxoo/omit';

import getDayStartsInInterval from '@mpieva/psydb-ui-lib/src/get-day-starts-in-interval';

import withWeeklyCalendarPages from '@mpieva/psydb-ui-lib/src/with-weekly-calendar-pages';
import CalendarNav from '@mpieva/psydb-ui-lib/src/calendar-nav';

import DaysHeader from './days-header';
import EmptyDaysRow from './empty-days-row';
import StudyRow from './study-row';

const headerStyle = {
    //marginLeft: '35px',
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

    var { value: revision, up: increaseRevision } = useRevision();
    var [ query, updateQuery ] = useURLSearchParams();
    // TODO: study selection
    
    var permissions = usePermissions();
    var [ showPast, setShowPast ] = useState(false);

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.fetchLocationExperimentCalendar({
            experimentType: 'away-team',
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
            { permissions.isRoot() && (
                <div className='mb-2'>
                    <Button
                        onClick={ () => setShowPast(showPast ? false : true) }
                        size='sm'
                    >zeige Vergangenheit</Button>
                </div>
            )}
            {/*<div className='bg-light'>
                <LinkButton to={ `/calendars` }>
                    <Icons.ArrowLeftShort style={{
                        height: '25px',
                        width: '25px',
                        merginLeft: '-10px',
                        marginTop: '-3px',
                    }} />
                    Zurück
                </LinkButton>
            </div>*/}

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

            { studyRecordLabels.length < 1 && (
                <EmptyDaysRow { ...({
                    allDayStarts,
                    style: headerStyle,
                }) } />
            )}

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
                    showPast,
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
