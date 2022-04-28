import React from 'react';
import { withRecordDetails } from '@mpieva/psydb-ui-lib';
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

    var subjectBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        crtSettings,
        related
    }

    return (
        <>
            <Subject { ...subjectBag }>
                <Subject.FullUserOrdered />
                <hr />
                <Subject.SystemPermissions />
            </Subject>
        </>
    )
}

export const RecordDetails = withRecordDetails({
    DetailsBody,
    shouldFetchSchema: false,
});
