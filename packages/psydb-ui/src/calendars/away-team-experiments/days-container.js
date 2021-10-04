import React, { useReducer, useEffect, useMemo } from 'react';

import {
    Container,
    Col,
    Row,
    LinkContainer
} from '@mpieva/psydb-ui-layout';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import getTextColor from '@mpieva/psydb-ui-lib/src/bw-text-color-for-background';
import applyValueToDisplayFields from '@mpieva/psydb-ui-lib/src/apply-value-to-display-fields';

import ReservationSlot from './reservation-slot';
import ExperimentSummary from './experiment-summary';

const DaysContainer = ({
    allDayStarts,
    experimentsByDayStart,
    reservationsByDayStart,
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
                        <ItemsInDay { ...({
                            start: dayStart,
                            experiments: (
                                experimentsByDayStart[dayStart.getTime()]
                            ),
                            reservations: (
                                reservationsByDayStart[dayStart.getTime()]
                            ),
                            ...other
                        }) } />
                    </Col>
                )) }
            </Row>
        </Container>
    );
}

const mergeItems = ({ experiments, reservations }) => {
    var merged = reservations.map(record => ({
        type: 'reservation', record
    }));
   
    for (var exp of experiments) {
        var index = merged.findIndex(({ type, record }) => (
            type === 'reservation' &&
            record.state.interval.start === exp.state.interval.start &&
            record.state.interval.end === exp.state.interval.end &&
            record.state.experimentOperatorTeamId === (
                exp.state.experimentOperatorTeamId
            )
        ));
        if (index === -1) {
            merged.push({ type: 'experiment', record: exp });
        }
        else {
            merged[index] = { type: 'experiment', record: exp };
        }
    }

    merged = merged.sort((a, b) => (
        a.record.state.experimentOperatorTeamId < b.record.state.experimentOperatorTeamId
        ? -1
        : 1
    ));

    return merged;
}

const ItemsInDay = ({
    start,
    experiments,
    reservations,
    ...other
}) => {

    var hasItems = (
        ( experiments && experiments.length > 0 ) ||
        ( reservations && reservations.length > 0 )
    )

    var merged = useMemo(() => (
        !hasItems ? [] : mergeItems({ experiments, reservations })
    ), [ experiments, reservations ]);

    return (
        <div>

            { /*<header className='text-center border-bottom mb-2'>
                <div role='button' onClick={ () => onSelectDay(start) }>
                    <b>{ datefns.format(start, 'cccccc dd.MM.') }</b>
                </div>
            </header>*/ }

            { 
                !hasItems
                ? (
                    <div className='text-muted text-center'>
                        <i>Keine Termine</i>
                    </div>
                )
                : (
                    merged.map((it, index) => (
                        it.type === 'experiment'
                        ? (
                            <ExperimentSummary { ...({
                                key: index,
                                style: itemStyle,
                                experimentRecord: it.record,
                                ...other,
                            }) } />
                        )
                        : (
                            <ReservationSlot { ...({
                                key: index,
                                style: itemStyle,
                                reservationRecord: it.record,
                                ...other
                            })} />
                        )
                    ))
                )
            }
        </div>
    );
}

const itemStyle = {
    minHeight: '110px'
}

export default DaysContainer;
