import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Pair, Split } from '@mpieva/psydb-ui-layout';
import { formatDateInterval } from '@mpieva/psydb-ui-lib';


const OnlineSurveyVariant = (ps) => {
    var {
        experimentTypeLabel,
        studyLabel,
        researchGroupLabel,
        interval,
    } = ps;

    var [{ translate, locale }] = useI18N();

    var {
        startDate, startTime, endTime
    } = formatDateInterval(interval, { locale });

    return (
        <>
            <Split num={2}>
                <Pair label={ translate('Study') }>
                    { studyLabel }
                </Pair>
                <Pair label={ translate('Type') }>
                    { translate(experimentTypeLabel) }
                </Pair>
            </Split>

            <Split num={2}>
                <Pair label={ translate('Date') }>
                    { startDate }
                </Pair>
                <Pair label={ translate('Time') }>
                    { startTime }
                    {' '}
                    { translate('to') }
                    {' '}
                    { endTime }
                </Pair>
            </Split>

            <Split num={2}>
                <Pair label={ translate('Research Group') }>
                    { researchGroupLabel }
                </Pair>
            </Split>
        </>
    )
};

export default OnlineSurveyVariant;
