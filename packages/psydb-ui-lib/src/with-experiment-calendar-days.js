import React from 'react';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { Container, Col, Row } from '@mpieva/psydb-ui-layout';

import CalendarDayHeader from './calendar-day-header';
import datefns from './date-fns';

export const withExperimentCalendarDays = (options) => {
    var {
        ExperimentSummaryDaily,
        ExperimentSummary3Day,
        ExperimentSummaryWeekly,
    } = options;

    const ExperimentCalendarDays = (ps) => {
        var {
            allDayStarts,
            experimentsByDayStart,
            ...pass
        } = ps;

        return (
            <Container>
                <Row>
                    { allDayStarts.map(dayStart => (
                        <Col
                            key={ dayStart.getTime() }
                            className='p-1'
                        >
                            <ExperimentsInDay { ...({
                                dayStart,
                                experiments: (
                                    experimentsByDayStart[dayStart.getTime()]
                                ),
                                ...pass
                            }) } />
                        </Col>
                    )) }
                </Row>
            </Container>
        );
    }

    const ExperimentsInDay = (ps) => {
        var {
            dayStart,
            experiments,
            calendarVariant,
            onSelectDay,
            ...pass
        } = ps;

        var translate = useUITranslation();

        var dayIndex = datefns.getISODay(dayStart);
        var dayEnd = datefns.endOfDay(dayStart);
        
        var isInPast = new Date().getTime() > dayEnd.getTime();
        var shouldEnable = (
            !isInPast
            // && !([6,7].includes(dayIndex))
        );
        var headerClassName = (
            shouldEnable
            ? 'text-center border-bottom mb-2'
            : 'text-center border-bottom mb-2 text-grey'
        );

        var ExperimentSummary = undefined;
        switch (calendarVariant) {
            case 'daily':
                ExperimentSummary = ExperimentSummaryDaily;
                break;
            case '3-day':
                ExperimentSummary = ExperimentSummary3Day;
                break;
            case 'weekly':
                ExperimentSummary = ExperimentSummaryWeekly;
                break;
        }

        return (
            <div>
                <CalendarDayHeader
                    className={ headerClassName }
                    onClick={ () => onSelectDay(dayStart) }
                    day={{ start: dayStart }}
                />
                { 
                    (!experiments || experiments.length < 1)
                        ? (
                            <div className='text-muted text-center'>
                                <i>{ translate('No Appointments') }</i>
                            </div>
                        )
                        : (
                            experiments.map(it => (
                                <ExperimentSummary { ...({
                                    key: it._id,
                                    experimentRecord: it,
                                    ...pass,
                                }) } />
                            ))
                        )
                }
            </div>
        );
    }
    
    return ExperimentCalendarDays;
}
