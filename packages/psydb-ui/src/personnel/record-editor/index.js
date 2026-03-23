import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { withRecordEditor, FormBox } from '@mpieva/psydb-ui-lib';
import { EditorMainForm } from './editor-main-form';
import { PasswordForm } from './password-form';

const EditForm = (ps) => {
    var { fetched } = ps;
    var { record } = fetched;

    var [{ translate }] = useI18N();
    var permissions = usePermissions();
    
    var isAnonymized = record.gdpr?.state === '[[REDACTED]]';
    var isHidden = record.scientific.state.systemPermissions.isHidden;
    return (
        <>
            <FormBox
                title={ translate('Edit Staff Member') }
                isRecordHidden={ isHidden }
            >
                <EditorMainForm { ...ps } isAnonymized={ isAnonymized } />
            </FormBox>
            {(
                !isAnonymized
                && permissions.hasFlag('canSetPersonnelPassword')
            ) && (
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
    shouldFetchCRTSettings: false
});

