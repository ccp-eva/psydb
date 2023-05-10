import React from 'react';
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
                        Vorherige Seite
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
                                    bis
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
                            'KW ' + datefns.format(currentPageStart, 'ww') + ' '
                        )}
                    </div>
                </div>

                <div
                    className='d-flex align-items-center'
                    style={{ cursor: 'pointer' }}
                    onClick={ () => onPageChange({ relativeChange: 'next' }) }
                >
                    <span className='d-inline-block mr-2'>
                        Nächste Seite
                    </span>
                    <Icons.ChevronRight />
                </div>
            </div>
        </>
    )
}

export default CalendarNav;
