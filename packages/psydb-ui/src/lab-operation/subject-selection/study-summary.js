import React from 'react';
import { useFetchChain } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import {
    Study,
    LabProcedureSettings
} from '@mpieva/psydb-ui-lib/data-viewers';

const StudySummary = (ps) => {
    var { studyId, settings, settingsRelated, subjectCRTSettings } = ps;

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

    var studyBag = {
        value: record,
        related,
        crtSettings
    }

    var settingsBag = {
        value: settings,
        related: settingsRelated,
        subjectCRTSettings
    }

    return (
        <div className='bg-light p-3 mb-3 border'>
            <Study { ...studyBag }>
                <div className='d-flex'>
                    <div className='w-33 pr-5'>
                        <header className='border-bottom mb-2'>
                            <b><Study.Shorthand noWrapper /></b>
                        </header>
                        { settings && (
                            <LabProcedureSettings { ...settingsBag }>
                                <LabProcedureSettings.SubjectsPerExperiment
                                    label='pro Termin'
                                />
                                <LabProcedureSettings.SubjectFieldRequirements
                                    label='Bedingungen'
                                />
                            </LabProcedureSettings>
                        )}
                    </div>
                    <div className='flex-grow'>
                        <Study.ExtraDescription />
                    </div>
                </div>
            </Study>
        </div>
    )
}

export default StudySummary;
