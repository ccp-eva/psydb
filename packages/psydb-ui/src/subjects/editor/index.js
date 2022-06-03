import React from 'react';
import { useParams } from 'react-router-dom';

import { useRevision } from '@mpieva/psydb-ui-hooks';
import { GenericRecordEditorFooter } from '@mpieva/psydb-ui-lib';
import { RecordEditor } from '@mpieva/psydb-ui-record-views/subjects';

const SubjectEditorContainer = ({
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
            <h3 className='border-bottom'>Proband:in bearbeiten</h3>
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

export default SubjectEditorContainer;
