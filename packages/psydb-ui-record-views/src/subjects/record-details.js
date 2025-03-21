import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import { Subject } from '@mpieva/psydb-ui-lib/data-viewers';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';

import { withRecordReader } from '../lib';
import { SequenceNumber, OnlineId, DuplicateInfo } from './shared-static';


const DetailsBody = (ps) => {
    var {
        collection,
        recordType,
        id,
        fetched,
        renderFormBox = true,
        onSuccessfulUpdate
    } = ps;

    var permissions = usePermissions();
    var [{ translate }] = useI18N();

    var { record, crtSettings, related } = fetched;
    
    var {
        showSequenceNumber,
        showOnlineId,
        fieldDefinitions,
    } = crtSettings;

    var {
        sequenceNumber,
        onlineId
    } = record;

    var { isHidden } = record.scientific.state.systemPermissions;
    var { mergedDuplicates = [] } = record.scientific.state.internals;
    
    var subjectBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        crtSettings,
        related
    }

    var exclude = [
        '/sequenceNumber',
        '/onlineId',
        ...((
            !permissions.hasFlag('canAccessSensitiveFields')
            && crtSettings.commentFieldIsSensitive
        ) ? [ '/scientific/state/comment' ] : [])
    ]

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
                <SequenceNumber
                    show={ showSequenceNumber } value={ sequenceNumber }
                    uiSplit={[ 4, 8 ]} className=''
                />
                <OnlineId
                    show={ showOnlineId } value={ onlineId }
                    uiSplit={[ 4, 8 ]} className=''
                />
                <DuplicateInfo
                    mergedDuplicates={ mergedDuplicates }
                    showOnlineId={ showOnlineId }
                    showSequenceNumber={ showSequenceNumber }

                    cols={[ '1fr', '2fr' ]} className=''
                />
                { (
                    (showSequenceNumber && sequenceNumber)
                    || (showOnlineId && onlineId)
                ) && (
                    <hr />
                )}
                <Subject { ...subjectBag }>
                    <Subject.FullUserOrdered exclude={ exclude } />
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

RecordDetails.Body = DetailsBody;
