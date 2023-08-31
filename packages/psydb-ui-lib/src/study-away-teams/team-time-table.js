import React from 'react';
import { dtoi, isotoi } from '@mpieva/psydb-date-interval-fns';

import {
    Container,
    Row,
    Col,
    ColoredBox,
} from '@mpieva/psydb-ui-layout';

import datefns from '../date-fns';
import TeamTimeSlot from './team-time-slot';

const TeamTimeTable = (ps) => {
    var {
        variant,

        teamRecord,
        onlyLocationId,
        allDays,
        allDayStarts,

        reservationRecords,
        experimentRecords,

        onSelectEmptySlot,
        onSelectReservationSlot,
        onSelectExperimentSlot,
        onSelectExperimentPlaceholderSlot,

        showPast,
    } = ps;

    var filteredExperiments = experimentRecords.filter(it => (
        it.state.experimentOperatorTeamId === teamRecord._id
    ));
    var filteredReservations = reservationRecords.filter(it => (
        it.state.experimentOperatorTeamId === teamRecord._id
    ));

    var itemsByDayStart = {};
    allDays.forEach(day => {
        var k = day.start.toISOString();
        
        // FIXME: this is still a hack
        var reservationRecord = spliceWithMaxOverlap({
            items: filteredReservations,
            interval: day,
        });
        var experimentRecord = spliceWithMaxOverlap({
            items: filteredExperiments,
            interval: day
        });

        itemsByDayStart[k] = {
            reservationRecord,
            experimentRecord,
        }
    })


    return (
        <Container>
            <Row>
                <Col className='p-0' style={{ flexGrow: 0 }}>
                    <ColoredBox
                        className='m-1'
                        bg={ teamRecord.state.color }
                        extraStyle={{ width: '30px', height: '26px' }}
                    />
                </Col>

                { allDays.map((day, ix) => {
                    var k = day.start.toISOString();
                    
                    var {
                        reservationRecord,
                        experimentRecord,
                    } = itemsByDayStart[k]

                    return <Col key={ ix } className='p-0'>
                        <TeamTimeSlot {...({
                            variant,
                            teamRecord,
                            onlyLocationId,
                            day,
                            dayStart: day.start,

                            reservationRecord,
                            experimentRecord,

                            onSelectEmptySlot,
                            onSelectReservationSlot,
                            onSelectExperimentSlot,
                            onSelectExperimentPlaceholderSlot,

                            showPast
                        }) } />
                    </Col>
                }) }
            </Row>
        </Container>
    )
}

var calculateOverlap = (that, other) => {
    // FIXME: breaks when start/end are reversed in that/other
    if (that.end <= other.start || that.start >= other.end) {
        return 0;
    }

    var maxStart = (
        that.start > other.start
        ? that.start
        : other.start
    );
    var minEnd = (
        that.end < other.end
        ? that.end
        : other.end
    );

    return (minEnd - maxStart);
}

// FIXME: hackjob
var spliceWithMaxOverlap = ({ items, interval }) => {
    var maxOverlap = 0;
    var maxIndex = undefined;
    for (var [ index, it ] of items.entries()) {
        var overlap = calculateOverlap(
            isotoi(it.state.interval),
            dtoi(interval)
        );
        if (overlap > maxOverlap) {
            maxOverlap = overlap;
            maxIndex = index;
        };
    }
    
    if (maxIndex === undefined) {
        return undefined
    }
    else {
        var it = items.splice(maxIndex, 1)[0];
        return it;
    }
}

export default TeamTimeTable;
