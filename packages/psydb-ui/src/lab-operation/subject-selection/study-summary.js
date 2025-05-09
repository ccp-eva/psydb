import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetchChain } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import {
    Study,
    LabProcedureSettings
} from '@mpieva/psydb-ui-lib/data-viewers';

import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';

const StudySummary = (ps) => {
    var { studyId, settings, settingsRelated, subjectCRTSettings } = ps;

    var translate = useUITranslation();

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
        theme: Themes.HorizontalSplit,
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
                                    label={ translate('per Appointment') }
                                />
                                <LabProcedureSettings.SubjectFieldRequirements
                                    label={ translate('Conditions') }
                                />
                            </LabProcedureSettings>
                        )}
                    </div>
                    <div className='w-66'>
                        <Study.ExtraDescription />
                    </div>
                </div>
            </Study>
        </div>
    )
}

export default StudySummary;
