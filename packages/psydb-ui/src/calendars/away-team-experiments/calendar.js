import React, { useMemo } from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';
import { sliceDays } from '@mpieva/psydb-date-interval-fns';

import {
    useFetch,
    useRevision,
    usePermissions,
    useURLSearchParams,
    useToggleReducer,
} from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator, ToggleButtons } from '@mpieva/psydb-ui-layout';

import {
    withWeeklyCalendarPages,
    CalendarNav,
    CalendarTeamLegend
} from '@mpieva/psydb-ui-lib';

import DaysHeader from './days-header';
import EmptyDaysRow from './empty-days-row';
import StudyRow from './study-row';

const headerStyle = {
    marginLeft: '35px', // spacing for study labels
}

const AwayTeamCalendar = (ps) => {
    var { currentPageStart, currentPageEnd, onPageChange } = ps;

    var { path, url } = useRouteMatch();
    var { locationType, researchGroupId } = useParams();

    var permissions = usePermissions();
    var revision = useRevision();
    
    var showPast = useToggleReducer(false, { as: 'props' });
    var [ query, updateQuery ] = useURLSearchParams();
    // TODO: study selection
    
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
    }, [ currentPageStart, currentPageEnd, revision.value ])

    var allDays = useMemo(() => sliceDays({
        start: currentPageStart,
        end: currentPageEnd
    }), [ currentPageStart, currentPageEnd ]);

    var allDayStarts = allDays.map(it => it.start);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        studyRecords,
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
                    <ToggleButtons.ShowPast { ...showPast } />
                </div>
            )}

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
                allDays,
                style: headerStyle,
            }) } />

            { studyRecordLabels.length < 1 && (
                <EmptyDaysRow { ...({
                    allDays,
                    style: headerStyle,
                }) } />
            )}

            { studyRecordLabels.map(it => (
                <StudyRow key={ it._id } { ...({
                    allDays,

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
                    showPast: showPast.value,
                    onSuccessfulUpdate: revision.up
                }) } />
            ))}

            <CalendarTeamLegend { ...({
                studyRecords,
                experimentOperatorTeamRecords,
                //activeTeamIds: teamSelection.value,
                //onClickTeam: (team) => {
                //    teamSelection.toggle(team._id)
                //}
            })} />
        </div>
    )
}

const WrappedAwayTeamCalendar = (
    withWeeklyCalendarPages(AwayTeamCalendar, { withURLSearchParams: true })
);

export default WrappedAwayTeamCalendar;
