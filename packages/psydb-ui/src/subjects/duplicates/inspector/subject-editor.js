import React from 'react';
import { useSendPatch, usePermissions } from '@mpieva/psydb-ui-hooks';
import { RecordEditor } from '@mpieva/psydb-ui-record-views/subjects';

const SubjectEditor = (ps) => {
    var {
        record, related, crtSettings,
        onSuccessfulUpdate, onFailedUpdate,
    } = ps;
    
    var permissions = usePermissions();
    var send = useSendPatch({
        collection: 'subject', recordType: record.type,
        record,
        subChannels: true,
        onSuccessfulUpdate,
        onFailedUpdate,

        __noLastKnownEventId: true,
    });

    var context = {
        fetched: { record, related, crtSettings },
        permissions, send,
    }
    return (
        <>
            <RecordEditor.Body
                { ...context }
                renderFormBox={ false }
                renderVisibilityButton={ false }
            />
        </>
    )
}

export default SubjectEditor;
