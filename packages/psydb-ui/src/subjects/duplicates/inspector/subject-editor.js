import React from 'react';
import { RecordEditor } from '@mpieva/psydb-ui-record-views/subjects';

const SubjectEditor = (ps) => {
    var { id, recordType, revision, onSuccessfulUpdate } = ps;
    
    var providerBag = {
        id, recordType,
        revision, onSuccessfulUpdate
    };
    return (
        <RecordEditor.Provider { ...providerBag }>
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
    )
}

export default SubjectEditor;
