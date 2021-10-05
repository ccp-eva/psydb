import React from 'react';
import { Container, Pair } from '@mpieva/psydb-ui-layout';

import datefns from './date-fns';

const ExperimentIntervalSummary = ({ experimentRecord }) => {
    var { start, end } = experimentRecord.state.interval;
    return (
        <Container>
            <Pair label='Datum'>
                { datefns.format(new Date(start), 'P') }
            </Pair>

            <Pair label='Beginn'>
                { datefns.format(new Date(start), 'p') }
            </Pair>
            <Pair label='Ende'>
                { datefns.format(
                    new Date(end).getTime() + 1,
                    'p'
                ) }
            </Pair>
        </Container>
    )
}

export default ExperimentIntervalSummary;
