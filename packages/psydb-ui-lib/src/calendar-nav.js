import React from 'react';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { Icons } from '@mpieva/psydb-ui-layout';

import datefns from './date-fns';

const CalendarNav = (ps) => {
    var {
        className = '',
        currentPageStart,
        currentPageEnd,
        onPageChange,
        showCalendarWeek = true,
    } = ps;

    var translate = useUITranslation();

    return (
        <div className={`d-flex justify-content-between ${className}`}>
            <PageNavButton
                type='prev'
                onClick={ onPageChange }
            />

            <DateInfo
                currentPageStart={ currentPageStart }
                currentPageEnd={ currentPageEnd }
                showCalendarWeek={ showCalendarWeek }
            />

            <PageNavButton
                type='next'
                onClick={ onPageChange }
            />
        </div>
    )
}

var PageNavButton = (ps) => {
    var { type, onClick, children } = ps;
    var translate = useUITranslation();

    return (
        <div
            className='d-flex align-items-center'
            style={{ cursor: 'pointer' }}
            onClick={ () => onClick({ relativeChange: type }) }
        >
            { type === 'prev' ? (
                <>
                    <Icons.ChevronLeft />
                    <span className='d-inline-block ml-2'>
                        { translate('Previous Page') }
                    </span>
                </>
            ) : (
                <>
                    <span className='d-inline-block mr-2'>
                        { translate('Next Page') }
                    </span>
                    <Icons.ChevronRight />
                </>
            )}
        </div>
    )
}

var DateInfo = (ps) => {
    var {
        currentPageStart,
        currentPageEnd,
        showCalendarWeek = true,
    } = ps;

    var translate = useUITranslation();
    var locale = useUILocale();

    var isSameDay = false
    if (datefns.isSameDay(currentPageStart, currentPageEnd)) {
        isSameDay = true;
    }

    return (
        <div>
            <div className='text-center'>
                { isSameDay ? (
                    <b>{ datefns.format(currentPageStart, 'P') }</b>
                ) : (
                    <>
                        <b>{ datefns.format(
                            currentPageStart, 'P',
                            { locale }
                        )}</b>
                        {' '}
                        { translate('to') }
                        {' '}
                        <b>{ datefns.format(
                            currentPageEnd, 'P',
                            { locale }
                        )}</b>
                    </>
                )}
            </div>
            {showCalendarWeek && (
                <div className='text-center'>
                    { translate('Calendar Week') }
                    {' '}
                    { datefns.format(currentPageStart, 'ww', { locale }) }
                </div>
            )}
        </div>
    )
}

export default CalendarNav;
