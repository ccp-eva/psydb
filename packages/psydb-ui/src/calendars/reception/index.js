import React from 'react';
import classnames from 'classnames';

import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import CalendarNav from '@mpieva/psydb-ui-lib/src/calendar-nav';
import withDailyCalendarPages from '@mpieva/psydb-ui-lib/src/with-daily-calendar-pages';

const Calendar = (ps) => {
    var {
        currentPageStart,
        currentPageEnd,
        onPageChange,
    } = ps;

    return (
        <div>
            <CalendarNav { ...({
                className: 'mt-3',
                currentPageStart,
                currentPageEnd,
                onPageChange,
            })} />

            <hr className='mt-1 mb-3' style={{
                marginLeft: '15em',
                marginRight: '15em',
            }}/>

            <DataPanel { ...({
                currentPageStart,
                currentPageEnd,
                onPageChange,
            })} />
        </div>
    )
}

const DataPanel = (ps) => {
    var {
        currentPageStart,
        currentPageEnd,
        onPageChange,
    } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.getAxios().post('/api/reception-calendar', {
            interval: { start: currentPageStart, end: currentPageEnd }
        })
    ), [ currentPageStart, currentPageEnd ])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    return (
        <div className='d-flex'>
            { fetched.data.map((researchGroup, index) => (
                <ResearchGroup
                    key={ index }
                    index={ index }
                    count={ fetched.data.length }
                    { ...researchGroup }
                />
            ))}
        </div>
    );
}

const ResearchGroup = (ps) => {
    var {
        count,
        index,

        _id,
        label,
        experiments
    } = ps;

    var className = classnames([
        'flex-grow-1',
        index > 0 && 'ml-3'
    ])

    return (
        <div className={ className } style={{ width: `${100/count}%` }}>
            <header className='border-bottom mb-2'>
                <b>{ label }</b>
            </header>
            { experiments.map((it, index) => (
                <Experiment key={ index } { ...it} />
            ))}
        </div>
    )
}

const Experiment = (ps) => {
    var {
        interval,
        personnelLabels,
        subjectGroups
    } = ps;
    var { start, end } = interval;

    return (
        <div className='bg-light border p-3 mb-2'>
            <div className='d-flex'>
                <div
                    className='border-right pr-3 mr-3 border-dark'
                    style={{ width: '70px' }}
                >
                    { datefns.format(new Date(start), 'HH:mm')}
                    <br />
                    {' - '}
                    { datefns.format(
                        new Date(new Date(end).getTime() + 1), 'HH:mm'
                    )}
                </div>
                <div className='flex-grow-1'>
                    { subjectGroups.map((group, index) => (
                        <SubjectGroup key={ index } { ...group } />
                    ))}
                    <hr />
                    { personnelLabels.join(', ')}
                </div>
            </div>
        </div>
    )
}

const SubjectGroup = (ps) => {
    var {
        typeLabel,
        recordLabels
    } = ps;

    return (
        <div>
            <header><b>{ typeLabel }</b></header>
            { recordLabels.map(label => (
                <div>- { label }</div>
            ))}
        </div>
    )
}

const WrappedCalendar = (
    withDailyCalendarPages(Calendar, { withURLSearchParams: true })
);

export default WrappedCalendar;
