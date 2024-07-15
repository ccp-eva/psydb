import React from 'react';
import { useUILanguage } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { FormHelpers } from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';

export const StudySubjectTypeSelect = (ps) => {
    var { label, value, onChange, studyId } = ps;
    var [ language ] = useUILanguage();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchStudyEnabledSubjectCRTs({
            studyId
        })
    ), {
        dependencies: [ studyId ],
        extraEffect: (response) => {
            var crts = response?.data?.data?.crts;
            if (crts.items().length === 1) {
                onChange(crts.items()[0].getType());
            }
        }
    });

    if (!didFetch) {
        return null;
    }

    var { crts } = fetched.data;

    if (crts.items().length === 1) {
        return null;
    }

    return (
        <FormHelpers.InlineWrapper label={ label }>
            <Controls.GenericEnum
                value={ value }
                onChange={ onChange }
                options={ crts.asOptions({ language }) }
            />
        </FormHelpers.InlineWrapper>
    )
}
