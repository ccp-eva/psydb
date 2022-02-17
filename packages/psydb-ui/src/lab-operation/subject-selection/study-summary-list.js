import React from 'react';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import { useFetchChain, useFetchAll } from '@mpieva/psydb-ui-hooks';
import { Study } from '@mpieva/psydb-ui-lib/data-viewers';

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

    var bag = {
        value: record,
        related,
        crtSettings
    }

    return (
        <div className='bg-light p-3 mb-3'>
            <Study { ...bag }>
                <div className='d-flex'>
                    <div className='w-25'>
                        <b><Study.Name noWrapper /></b>
                    </div>
                    <div className='flex-grow'>
                        <Study.Custom />
                    </div>
                </div>
            </Study>
        </div>
    )
}

export default StudySummaryList
