import React from 'react';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import { useFetchChain, useFetchAll } from '@mpieva/psydb-ui-hooks';

const StudySummaryList = (ps) => {
    var {
        studyIds,
        labProcedureTypeKey,
        subjectTypeKey
    } = ps;

    /*var [ didFetch, fetched ] = useFetchAll((agent) => ({
        ...studyIds.reduce((acc, it) => ({
            ...acc, [it]: agent.readRecord({
                collection: 'study',
                id: it
            }, {})
        }), {}),
        labProcedureSettings: agent.fetchExperimentVariantSettings({
            studyIds
        }),
    }), [ studyIds ])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var studyDataList = studyIds.map(it => fetched[it].data);
    var {
        records: settings,
        ...settingRelated
    } = fetched.labProcedureSettings.data;*/

    return (
        <div>
            { studyIds.map(it => {
                return (
                    <StudySummary
                        key={ it }
                        studyId={ it }
                    />
                );
            })}
        </div>
    )
}

const StudySummary = (ps) => {
    var { studyId } = ps;

    var [ didFetch, fetched ] = useFetchChain(() => ([
        ({ agent }) => ({
            record: agent.readRecord({ collection: 'study', id: studyId }),
        }),
        ({ agent, context }) => ({
            crtSettings: agent.readCRTSettings({
                collection: 'study',
                recordType: context.record.data.record.type
            })
        })
    ]), [ studyId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        record,
        ...related
    } = fetched.record.data;
    var crtSettings = fetched.crtSettings.data;

    return (
        <div>
            { record.state.name }
        </div>
    )
}

export default StudySummaryList
