import React from 'react';
import { useParams } from 'react-router-dom';

import { useRevision } from '@mpieva/psydb-ui-hooks';
import { RecordEditor } from './record-editor';
import LocationEditorFooter from './editor-container-footer';

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
                    <LocationEditorFooter
                        onSuccessfulUpdate={ revision.up }
                    />
                )}
            </RecordEditor>
        </>
    )
}

export default LocationEditorContainer;
