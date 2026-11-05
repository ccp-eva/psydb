import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Pair, Split } from '@mpieva/psydb-ui-layout';
import { formatDateInterval } from '@mpieva/psydb-ui-lib';

import TeamNameAndColor from '@mpieva/psydb-ui-lib/src/team-name-and-color';
import Experimenters from './experimenters';


const InviteVariant = (ps) => {
    var {
        experimentTypeLabel,
        studyLabel,
        researchGroupLabel,
        interval,
        locationData,
        opsTeamData,
        opsTeamRelated,
        experimentOperatorIds,
        experimentRelated,
    } = ps;

    var [{ translate, locale }] = useI18N();
    var hasExperimenters = experimentOperatorIds?.length > 0;

    var {
        startDate, startTime, endTime
    } = formatDateInterval(interval, { locale });

    return (
        <>
            <Split num={2}>
                <Pair label={ translate('Study') }>
                    { studyLabel }
                </Pair>
                { hasExperimenters ? (
                    <Pair label={ translate('Experimenters') }>
                        <Experimenters
                            ids={ experimentOperatorIds }
                            related={ experimentRelated }
                        />
                    </Pair>
                ) : (
                    <Pair label={ translate('Team') }>
                        { opsTeamData ? (
                            <TeamNameAndColor
                                teamRecord={ opsTeamData.record }
                                related={ opsTeamRelated }
                            />
                        ) : (
                            translate('Unknown')
                        )}
                    </Pair>
                )}
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

            <Split>
                <Pair label={ translate('Research Group') }>
                    { researchGroupLabel }
                </Pair>
                <Pair label={ translate('Type') }>
                    { translate(experimentTypeLabel) }
                </Pair>
            </Split>
            
            <Split>
                <Pair label={ translate('Location') }>
                    { locationData.record._recordLabel}
                </Pair>
                <Pair label={ translate('Location Type') }>
                    { locationData.recordTypeLabel}
                </Pair>
            </Split>
        </>
    )
};

export default InviteVariant;
