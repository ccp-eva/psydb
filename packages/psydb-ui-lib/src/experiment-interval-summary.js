import React from 'react';

import {
    format as formatDateInterval
} from '@mpieva/psydb-date-interval-fns';

import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { Container, Pair } from '@mpieva/psydb-ui-layout';

const ExperimentIntervalSummary = (ps) => {
    var { experimentRecord } = ps;
    var { start, end } = experimentRecord.state.interval;
    
    var translate = useUITranslation();
    var locale = useUILocale();

    var { startDate, startTime, endTime } = formatDateInterval(
        experimentRecord.state.interval,
        { locale }
    );

    return (
        <Container>
            <Pair label={ translate('Date') }>
                { startDate }
            </Pair>

            <Pair label={ translate('Start') }>
                { startTime }
            </Pair>
            <Pair label={ translate('End') }>
                { endTime }
            </Pair>
        </Container>
    )
}

export default ExperimentIntervalSummary;
