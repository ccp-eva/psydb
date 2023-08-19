import React, { useReducer, useEffect, useMemo } from 'react';

import { hasNone } from '@mpieva/psydb-core-utils';
import { dtoi } from '@mpieva/psydb-date-interval-fns';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import { Container, Col, Row } from '@mpieva/psydb-ui-layout';

import ReservationSlot from './reservation-slot';
import ExperimentSummary from './experiment-summary';

// NOTE
//var rewired = rewire(that, {
//    foo: [ 'a', 'b' ],
//    bar: [ 'b', 'c' ]
//});
//var { foo, bar } = rewired;

const DaysContainer = (ps) => {
    var {
        allDays,
        experimentsByDayStart,
        reservationsByDayStart,
        ...pass
    } = ps;
    
    return (
        <Container style={{ maxWidth: '100%' }}>
            <Row>
                { allDays.map((day, ix) => {
                    var { start } = dtoi(day);
                    
                    var bag = {
                        start,
                        experiments: experimentsByDayStart[start],
                        reservations: reservationsByDayStart[start],
                        ...pass
                    }

                    return <Col key={ ix } className='p-1'>
                        <ItemsInDay { ...bag } />
                    </Col>
                }) }
            </Row>
        </Container>
    );
}

// FIXME: OMG
// => compareBy({ a, b, paths: [
//     'state.interval.start',
//     'state.interval.end',
//     'state.experimentOperatorTeamId'
// ]}) or something
//
// type === reservation && compareBy(...) === 0 .... for equality
//
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

const ItemsInDay = (ps) => {
    var {
        start,
        experiments = [],
        reservations = [],
        ...pass
    } = ps;

    var translate = useUITranslation();

    if (hasNone(experiments) && hasNone(reservations)) {
        return (
            <div className='text-muted text-center'>
                <i>{ translate('No Appointments') }</i>
            </div>
        );
    }

    var merged = mergeItems({ experiments, reservations });
    return (
        <div> {
            merged.map((it, ix) => {
                var { type, record } = it;
                
                var sharedBag = {
                    key: ix,
                    style: { minHeight: '130px' },
                    ...pass
                };

                return (
                    type === 'experiment'
                    ? <ExperimentSummary
                        { ...sharedBag }
                        experimentRecord={ record }
                    />
                    : <ReservationSlot 
                        { ...sharedBag }
                        reservationRecord={ record }
                    />
                );
            })
        }</div>
    );
}

export default DaysContainer;
