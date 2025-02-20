import React from 'react';
import { useRevision } from '@mpieva/psydb-ui-hooks';
import { RecordEditor } from '@mpieva/psydb-ui-record-views/subjects';

const SubjectContainer = (ps) => {
    var { id, recordType, onSuccessfulUpdate } = ps;
    var revision = useRevision();

    var editorBag = {
        id, recordType,
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
                                renderFormBox={ false }
                                renderVisibilityButton={ false }
                            />
                            {/*<GenericRecordEditorFooter.RAW
                                { ...context }
                                enableHide={ false }
                                enableRemove={ true }
                                onSuccessfulUpdate={ revision.up }
                            />*/}
                        </>
                    )}
                </RecordEditor.Context.Consumer>
            </RecordEditor.Provider>
        </>
    )
}

export default SubjectContainer
