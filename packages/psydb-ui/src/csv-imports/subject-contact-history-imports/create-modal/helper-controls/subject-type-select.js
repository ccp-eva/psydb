import React from 'react';
import { FormHelpers } from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';

export const SubjectTypeSelect = (ps) => {
    var { label, crts, ...pass } = ps;
    return (
        <FormHelpers.InlineWrapper label={ label }>
            <Controls.GenericTypeKey
                { ...pass }
                collection='subject'
            />
        </FormHelpers.InlineWrapper>
    )
}
