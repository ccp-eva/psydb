import React, { useReducer, useEffect, useMemo } from 'react';

import {
    Container,
    Col,
    Row,
    LinkContainer,
} from '@mpieva/psydb-ui-layout';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import getTextColor from '@mpieva/psydb-ui-lib/src/bw-text-color-for-background';
import applyValueToDisplayFields from '@mpieva/psydb-ui-lib/src/apply-value-to-display-fields';

import ExperimentSummarySmall  from './experiment-summary/cal-small';
import ExperimentSummaryMedium  from './experiment-summary/cal-medium';

const DaysContainer = ({
    allDayStarts,
    experimentsByDayStart,
    ...other
}) => {
    return (
        <Container>
            <Row>
                { allDayStarts.map(dayStart => (
                    <Col
                        key={ dayStart.getTime() }
                        className='p-1'
                    >
                        <ExperimentsInDay { ...({
                            start: dayStart,
                            experiments: (
                                experimentsByDayStart[dayStart.getTime()]
                            ),
                            ...other
                        }) } />
                    </Col>
                )) }
            </Row>
        </Container>
    );
}

const ExperimentsInDay = ({
    start,
    experiments,
    calendarVariant,
    onSelectDay,
    ...other
}) => {

    var ExperimentSummary = undefined;
    switch (calendarVariant) {
        case 'daily':
            ExperimentSummary = ExperimentSummaryMedium;
            break;
        case '3-day':
            ExperimentSummary = ExperimentSummaryMedium;
            break;
        case 'weekly':
            ExperimentSummary = ExperimentSummarySmall;
            break;
    }

    return (
        <div>
            <header className='text-center border-bottom mb-2'>
                <div role='button' onClick={ () => onSelectDay(start) }>
                    <b>{ datefns.format(start, 'cccccc dd.MM.') }</b>
                </div>
            </header>
            { 
                (!experiments || experiments.length < 1)
                ? (
                    <div className='text-muted text-center'>
                        <i>Keine Termine</i>
                    </div>
                )
                : (
                    experiments.map(it => (
                        <ExperimentSummary { ...({
                            key: it._id,
                            experimentRecord: it,
                            ...other,
                        }) } />
                    ))
                )
            }
        </div>
    );
}

export default DaysContainer;
