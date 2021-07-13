import React, { useReducer, useEffect, useMemo } from 'react';

import {
    Container,
    Col,
    Row,
} from 'react-bootstrap';

import {
    LinkContainer
} from 'react-router-bootstrap';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import getTextColor from '@mpieva/psydb-ui-lib/src/bw-text-color-for-background';
import applyValueToDisplayFields from '@mpieva/psydb-ui-lib/src/apply-value-to-display-fields';

import ExperimentSummary from './experiment-summary';

const DaysContainer = ({
    allDayStarts,
    experimentsByDayStart,
    ...other
}) => {
    return (
        <Container style={{ maxWidth: '100%' }}>
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
