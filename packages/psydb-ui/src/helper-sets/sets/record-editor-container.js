import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { useRevision } from '@mpieva/psydb-ui-hooks';
import { GenericRecordEditorFooter } from '@mpieva/psydb-ui-lib';
import { RecordEditor } from './record-editor';

export const RecordEditorContainer = ({
    collection,
    recordType,
    onSuccessfulUpdate,
}) => {
    var { id } = useParams();
    var { url } = useRouteMatch();
    var revision = useRevision();

    var editorBag = {
        id, collection, recordType,
        revision, onSuccessfulUpdate
    };
    return (
        <>
            <RecordEditor { ...editorBag }>
                {() => (
                    <GenericRecordEditorFooter
                        enableHide={ false }
                        enableRemove={ true }
                        onSuccessfulUpdate={ revision.up }
                    />
                )}
            </RecordEditor>
        </>
    )
}
