import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Subject } from '@mpieva/psydb-ui-lib/data-viewers';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';

import { withRecordReader } from '../lib';


const DetailsBody = (ps) => {
    var {
        collection,
        recordType,
        id,
        fetched,
        renderFormBox = true,
        onSuccessfulUpdate
    } = ps;

    var translate = useUITranslation();

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
                        { translate('Hidden Record') }
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
