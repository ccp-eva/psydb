import React from 'react';
import { useParams } from 'react-router-dom';

import { useRevision } from '@mpieva/psydb-ui-hooks';
import { GenericRecordEditorFooter } from '@mpieva/psydb-ui-lib';
import { RecordEditor } from './record-editor';

const LocationEditorContainer = ({
    collection,
    recordType,
    onSuccessfulUpdate,
}) => {
    var { id } = useParams();
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
                        enableHide={ true }
                        enableRemove={ true }
                        onSuccessfulUpdate={ revision.up }
                    />
                )}
            </RecordEditor>
        </>
    )
}

export default LocationEditorContainer;
