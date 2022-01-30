import React from 'react';

import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { withRecordEditor } from '@mpieva/psydb-ui-lib';
import { EditorMainForm } from './editor-main-form';
import { PasswordForm } from './password-form';

const EditForm = (ps) => {
    var permissions = usePermissions();
    return (
        <>
            <EditorMainForm { ...ps } />
            { permissions.isRoot() && (
                <div className='mt-3'>
                    <PasswordForm { ...ps } />
                </div>
            )}
        </>
    )
}

export const RecordEditor = withRecordEditor({
    EditForm,
    shouldFetchSchema: false,
    shouldCRTSettings: false
});

