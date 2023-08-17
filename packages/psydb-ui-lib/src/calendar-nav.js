import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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

    var isSameDay = false
    if (datefns.isSameDay(currentPageStart, currentPageEnd)) {
        isSameDay = true;
    }
    return (
        <>
            <div className={`d-flex justify-content-between ${className}`}>
                <div
                    className='d-flex align-items-center'
                    style={{ cursor: 'pointer' }}
                    onClick={ () => onPageChange({ relativeChange: 'prev' }) }
                >
                    <Icons.ChevronLeft />
                    <span className='d-inline-block ml-2'>
                        { translate('Previous Page') }
                    </span>
                </div>

                <div>
                    <div className='text-center'>
                        { 
                            !isSameDay
                            ? (
                                <>
                                    <b>{ datefns.format(currentPageStart, 'P') }</b>
                                    {' '}
                                    { translate('to') }
                                    {' '}
                                    <b>{ datefns.format(currentPageEnd, 'P') }</b>
                                </>
                            )
                            : (
                                <b>{ datefns.format(currentPageStart, 'P') }</b>
                            )
                        }
                    </div>
                    <div className='text-center'>
                        {showCalendarWeek && (
                            translate('Calendar Week') + ' ' + datefns.format(currentPageStart, 'ww') + ' '
                        )}
                    </div>
                </div>

                <div
                    className='d-flex align-items-center'
                    style={{ cursor: 'pointer' }}
                    onClick={ () => onPageChange({ relativeChange: 'next' }) }
                >
                    <span className='d-inline-block mr-2'>
                        { translate('Next Page') }
                    </span>
                    <Icons.ChevronRight />
                </div>
            </div>
        </>
    )
}

export default CalendarNav;
