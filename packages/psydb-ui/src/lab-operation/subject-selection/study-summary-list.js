import React from 'react';
import { keyBy } from '@mpieva/psydb-core-utils';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import { useFetchAll } from '@mpieva/psydb-ui-hooks';

import StudySummary from './study-summary';

const StudySummaryList = (ps) => {
    var {
        studyIds,
        labProcedureTypeKey,
        subjectTypeKey
    } = ps;

    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        subjectCRTSettings: agent.readCRTSettings({
            collection: 'subject',
            recordType: subjectTypeKey
        }),
        labProcedureSettings: agent.fetchExperimentVariantSettings({
            studyIds
        }),
    }), [ studyIds ])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        records: settings,
        ...settingsRelated
    } = fetched.labProcedureSettings.data;

    var subjectCRTSettings = fetched.subjectCRTSettings.data;

    settings = settings.filter(it => (
        it.type === labProcedureTypeKey &&
        it.state.subjectTypeKey === subjectTypeKey
    ));

    var settingsByStudy = keyBy({
        items: settings,
        byProp: 'studyId'
    });

    return (
        <div>
            { studyIds.map(it => {
                return (
                    <StudySummary
                        key={ it }
                        studyId={ it }
                        settings={ settingsByStudy[it] }
                        settingsRelated={ settingsRelated }
                        subjectCRTSettings={ subjectCRTSettings }
                    />
                );
            })}
        </div>
    )
}


export default StudySummaryList
