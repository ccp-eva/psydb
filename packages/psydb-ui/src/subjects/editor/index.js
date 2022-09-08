import React from 'react';

import { useRevision } from '@mpieva/psydb-ui-hooks';
import { GenericRecordEditorFooter } from '@mpieva/psydb-ui-lib';
import { RecordEditor } from '@mpieva/psydb-ui-record-views/subjects';

const SubjectEditorContainer = ({
    recordType,
    onSuccessfulUpdate,
}) => {
    var revision = useRevision();

    var editorBag = {
        recordType,
        revision, onSuccessfulUpdate
    };
    return (
        <>
            <RecordEditor.Provider { ...editorBag }>
                <RecordEditor.Context.Consumer>
                    {(context) => (
                        <>
                            <RecordEditor.Body
                                { ...context }
                                renderVisibilityButton={ true }
                            />
                            <GenericRecordEditorFooter.RAW
                                { ...context }
                                enableHide={ false }
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
