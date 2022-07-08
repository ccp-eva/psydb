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
            <RecordEditor.Provider { ...editorBag }>
                <RecordEditor.Context.Consumer>
                    {(context) => (
                        <>
                            <RecordEditor.Body { ...context } />
                            <GenericRecordEditorFooter.RAW
                                { ...context }
                                enableHide={ true }
                                enableRemove={ true }
                                onSuccessfulUpdate={ revision.up }
                            />
                        </>
                    )}
                </RecordEditor.Context.Consumer>
            </RecordEditor.Provider>
        </>
    )
}

export default SubjectEditorContainer;
