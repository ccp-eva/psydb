import React, { useState } from 'react';
import { useRevision, useURLSearchParamsB64 } from '@mpieva/psydb-ui-hooks';
import { Grid } from '@mpieva/psydb-ui-layout';
import { RecordEditor } from '@mpieva/psydb-ui-record-views/subjects';

const Inspector = (ps) => {
    var { recordType } = ps;
    var [ query, updateQuery ] = useURLSearchParamsB64();

    var [ leftId, setLeftId ] = useState(query[0]);
    var [ rightId, setRightId ] = useState(query[1]);

    return (
        <Grid cols={[ '1fr', '1fr' ]} gap='1rem'>
            <div className='p-3 bg-light border'>
                <SubjectEditorContainer
                    recordType={ recordType }
                    id={ leftId }
                />
            </div>
            <div className='p-3 bg-light border'>
                <SubjectEditorContainer
                    recordType={ recordType }
                    id={ rightId }
                />
            </div>
        </Grid>
    )
}

const SubjectEditorContainer = (ps) => {
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

export default Inspector;
