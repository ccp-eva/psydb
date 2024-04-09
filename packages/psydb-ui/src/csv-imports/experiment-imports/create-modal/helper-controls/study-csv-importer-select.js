import React from 'react';
import { useUITranslation, useUILanguage } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { FormHelpers } from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';

export const StudyCSVImporterSelect = (ps) => {
    var { label, value, onChange, studyId, subjectType, importType } = ps;
    
    var translate = useUITranslation();
    var [ language ] = useUILanguage();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchStudyEnabledCSVImporters({
            studyId, subjectType, importType
        })
    ), {
        dependencies: [ studyId, subjectType, importType ],
        extraEffect: (response) => {
            var csvImporters = response?.data?.data?.csvImporters;
            if (csvImporters.length === 1) {
                onChange(csvImporters[0]);
            }
        }
    });

    if (!didFetch) {
        return null;
    }

    var { csvImporters } = fetched.data;
    if (csvImporters.length === 1) {
        return null;
    }

    var options = {};
    for (var it of csvImporters) {
        options[it] = 'csvImporter_experiment_' + it;
    }
    return (
        <FormHelpers.InlineWrapper label={ label }>
            <Controls.GenericEnum
                value={ value }
                onChange={ onChange }
                options={ translate.options(options) }
            />
        </FormHelpers.InlineWrapper>
    )
}
