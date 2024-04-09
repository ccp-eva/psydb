import React from 'react';
import { FormHelpers } from '@mpieva/psydb-ui-layout';
import { RecordPicker } from '@mpieva/psydb-ui-lib';

export const StudyRecordPicker = (ps) => {
    var { label, studyType, ...pass } = ps;
    return (
        <FormHelpers.InlineWrapper label={ label }>
            <RecordPicker
                { ...pass }
                collection='study'
                recordType={ studyType }
            />
        </FormHelpers.InlineWrapper>
    )
}
