import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Fields, withField, withFieldArray } from '@mpieva/psydb-ui-lib';

const MailAttachment = withField({
    Control: (ps) => {
        var { dataXPath, formikForm, disabled } = ps;
        var { getFieldProps, setFieldValue } = formikForm;
        var [{ translate }] = useI18N();

        // NOTE: prefill the label with the file name when its still empty
        var onUploaded = (fileId, { record } = {}) => {
            var label = getFieldProps(`${dataXPath}.label`).value;
            if (record && !label) {
                setFieldValue(`${dataXPath}.label`, record.originalFilename);
            }
        }

        return (
            <>
                <Fields.FileId
                    dataXPath={ `${dataXPath}.fileId` }
                    label={ translate('File') }
                    disabled={ disabled }
                    extraOnChange={ onUploaded }
                    required
                />
                <Fields.SaneString
                    dataXPath={ `${dataXPath}.label` }
                    label={ translate('Label') }
                    disabled={ disabled }
                    formGroupClassName='m-0'
                    required
                />
            </>
        )
    },
    DefaultWrapper: ({ children }) => (<>{ children }</>),
});

const MailAttachmentListArray = withFieldArray({
    FieldComponent: MailAttachment,
    ArrayContentWrapper: 'ObjectArrayContentWrapper',
    ArrayItemWrapper: 'ObjectArrayItemWrapper',
    defaultItemValue: { fileId: null, label: '' },
});

export const MailAttachmentList = (ps) => (
    <MailAttachmentListArray { ...ps } enableMove={ false } />
);
