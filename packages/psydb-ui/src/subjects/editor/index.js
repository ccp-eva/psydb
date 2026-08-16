import React from 'react';

import { useRevision } from '@mpieva/psydb-ui-hooks';
import { GenericRecordEditorFooter } from '@mpieva/psydb-ui-lib';
import { RecordEditor } from '@mpieva/psydb-ui-record-views/subjects';

const SubjectEditorContainer = (ps) => {
    var { recordType, onSuccessfulUpdate } = ps;
    
    var revision = useRevision();
    var editorBag = { recordType, revision, onSuccessfulUpdate };

    return (
        <>
            <RecordEditor.Provider { ...editorBag }>
                <RecordEditor.Context.Consumer>
                    {(context) => {
                        var { fetched } = context;
                        var { record } = fetched;
                        var isAnonymized = record.gdpr?.state === '[[REDACTED]]';

                        return <>
                            <RecordEditor.Body
                                { ...context }
                                renderVisibilityButton={ true }
                            />
                            <GenericRecordEditorFooter.RAW
                                { ...context }
                                enableHide={ isAnonymized }
                                enableRemove={ true }
                                enableCleanGdpr={ true }
                                onSuccessfulUpdate={ revision.up }
                            />
                        </>
                    }}
                </RecordEditor.Context.Consumer>
            </RecordEditor.Provider>
        </>
    )
}

export default SubjectEditorContainer;
