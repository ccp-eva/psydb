import React from 'react';
import { FormHelpers } from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';

export const StudyTypeSelect = (ps) => {
    var { label, ...pass } = ps;
    return (
        <FormHelpers.InlineWrapper label={ label }>
            <Controls.GenericTypeKey
                { ...pass }
                collection='study'
            />
        </FormHelpers.InlineWrapper>
    )
}
