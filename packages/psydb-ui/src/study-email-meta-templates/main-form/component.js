import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

import { QuillHTML } from './quill-html';
import { MailAttachmentList } from './mail-attachment-list';

export const Component = (ps) => {
    var { initialValues, onSubmit, related } = ps;
    var [{ translate }] = useI18N();

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ onSubmit }
            useAjvAsync
        >
            {(formikProps) => (
                <>
                    <FormFields related={ related }/>
                    <Button type='submit'>
                        { translate('Save') }
                    </Button>
                </>
            )}
        </DefaultForm>
    );
}

// NOTE: mailText is not editable yet and is passed through
const FormFields = (ps) => {
    var { related } = ps;
    var [{ translate }] = useI18N();

    return (
        <>
            <Fields.SaneString
                label={ translate('Template-Shorthand') }
                dataXPath='$.templateName'
                required
            />
            <Fields.SaneString
                label={ translate('Mail Subject') }
                dataXPath='$.mailSubject'
                required
            />
            <Fields.SaneString
                label={ translate('Sender') }
                dataXPath='$.mailSender'
                required
            />
            <QuillHTML
                label={ translate('HTML Text') }
                dataXPath='$.mailHTML'
            />
            <MailAttachmentList
                label={ translate('Attachments') }
                dataXPath='$.mailAttachments'
            />
            <Fields.URLStringList
                label={ translate('Links') }
                dataXPath='$.mailLinks'
            />
            <Fields.DefaultBool
                label={ translate('Enabled') }
                dataXPath='$.isEnabled'
                required
            />
            <Fields.AccessRightByResearchGroupList
                label={ translate('Record Access for') }
                dataXPath='$.systemPermissions.accessRightsByResearchGroup'
                related={ related }
                required
            />
            <Fields.DefaultBool
                label={ translate('Hidden') }
                dataXPath='$.systemPermissions.isHidden'
            />
        </>
    );
}
