import React from 'react';
import { usePermissions  } from '@mpieva/psydb-ui-hooks';
import { withRecordEditor } from '@mpieva/psydb-ui-lib';
import { Subject } from '@mpieva/psydb-ui-lib/data-viewers';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';

const DetailsBody = (ps) => {
    var {
        collection,
        recordType,
        id,
        fetched,
        renderFormBox = true,
        onSuccessfulUpdate
    } = ps;

    var { record, crtSettings, related } = fetched;
    var { fieldDefinitions } = crtSettings;

    var permissions = usePermissions();

    var subjectBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        crtSettings,
        related
    }

    return (
        <>
            <Subject { ...subjectBag }>
                <Subject.CustomGDPR />
            </Subject>
            <div>FOO</div>
        </>
    )
}

// TODO withRecordDetails
export const RecordDetails = withRecordEditor({
    EditForm: DetailsBody,
    shouldFetchSchema: false,
});
