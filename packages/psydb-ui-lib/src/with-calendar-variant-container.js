import React  from 'react';
import omit from '@cdxoo/omit';
import { useParams } from 'react-router-dom';

import {
    usePermissions,
    //useToggleReducer,
    useURLSearchParams,
} from '@mpieva/psydb-ui-hooks';

import {
    ToggleButtons
} from '@mpieva/psydb-ui-layout';

import withVariableCalendarPages from './with-variable-calendar-pages';
import { CalendarRangePillNav } from './calendar-range-pill-nav';
import { CalendarStudyPillNav } from './calendar-study-pill-nav';

const PillNavContainer = (ps) => {
    var { label, children } = ps;

    return (
        <div className='d-flex mb-2'>
            <div style={{ width: '100px', paddingTop: '.2rem' }}>
                <b>{ label }</b>
            </div>
            <div className='flex-grow'>
                { children }
            </div>
        </div>
    );
}

export const withCalendarVariantContainer = (options = {}) => {
    var {
        Calendar,
        showVariantSelect = true,
        showStudySelect = true,
        // withURLSearchParams = true // TODO
    } = options;

    const WrappedCalendar = (
        withVariableCalendarPages(Calendar, { withURLSearchParams: true })
    );

    const CalendarVariantContainer = (ps) => {
        var { inviteType } = ps;
        var { researchGroupId } = useParams();

        var [ query, updateQuery ] = useURLSearchParams();
        var permissions = usePermissions();
        //var showPast = useToggleReducer(false, { as: 'props' });
        // FIXME: move to togglebutton and add property withURLSearchParams?
        // FIXME: can we add conversions to withURLSearchParams hook?
        var showPast = {
            value: permissions.isRoot() ? query.showPast === 'true' : false,
            onToggle: () => {
                var value = query.showPast === 'true';
                updateQuery({ ...query, showPast: !value })
            }
        }

        var {
            cal: calendarVariant,
            study: selectedStudyId,
        } = query;

        calendarVariant = calendarVariant || '3-day';
        selectedStudyId = selectedStudyId || null;

        return (
            <>
                { permissions.isRoot() && (
                    <div className='mb-2'>
                        <ToggleButtons.ShowPast { ...showPast } />
                    </div>
                )}
                { showVariantSelect && (
                    <PillNavContainer label='Ansicht'>
                        <CalendarRangePillNav { ...({
                            selectedVariant: calendarVariant,
                            onSelectVariant: (next) => updateQuery({
                                ...query, cal: next
                            })
                        }) } />
                    </PillNavContainer>
                )}

                { showStudySelect && (
                    <PillNavContainer label='Studien'>
                        <CalendarStudyPillNav { ...({
                            experimentType: inviteType,
                            researchGroupId,
                            selectedStudyId,
                            onSelectStudy: (next) => {
                                if (next) {
                                    updateQuery({ ...query, study: next })
                                }
                                else {
                                    updateQuery(omit('study', query));
                                }
                            }
                        }) } />
                    </PillNavContainer>
                )}

                <WrappedCalendar { ...({
                    calendarVariant,
                    selectedStudyId,
                    showPast: showPast.value,
                    onSelectDay: (date) => {
                        updateQuery({
                            ...query,
                            cal: 'daily',
                            d: date.getTime()
                        })
                    },
                    ...ps
                }) } />
            </>
        )
    }

    return CalendarVariantContainer;
}
