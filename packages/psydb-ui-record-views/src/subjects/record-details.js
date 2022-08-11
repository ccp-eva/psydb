import React from 'react';
import { withRecordReader } from '../lib';
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

    var isHidden = record.scientific.state.systemPermissions.isHidden;

    return (
        <>
            { isHidden && (
                <>
                    <h5 className='text-muted'>
                        Datensatz ist Ausgeblendet
                    </h5>
                    <hr />
                </>
            )}
            <div style={ isHidden ? { opacity: 0.5 } : {}}>
                <Subject { ...subjectBag }>
                    <Subject.FullUserOrdered />
                    <hr />
                    <Subject.SystemPermissions />
                </Subject>
            </div>
        </>
    )
}

export const RecordDetails = withRecordReader({
    Body: DetailsBody,

    collection: 'subject',
    shouldFetchSchema: false
});
