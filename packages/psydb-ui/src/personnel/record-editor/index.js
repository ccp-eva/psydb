import React from 'react';

import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { withRecordEditor } from './with-record-editor';
import { MainForm } from './main-form';
import { PasswordForm } from './password-form';

const EditForm = (ps) => {
    var permissions = usePermissions();
    return (
        <>
            <MainForm { ...ps } />
            { permissions.isRoot() && (
                <div className='mt-3'>
                    <PasswordForm { ...ps } />
                </div>
            )}
        </>
    )
}

export const RecordEditor = withRecordEditor({ EditForm });

