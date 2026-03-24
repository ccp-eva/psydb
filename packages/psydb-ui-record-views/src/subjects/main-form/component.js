import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { AsyncButton } from '@mpieva/psydb-ui-layout';
import {
    DefaultForm,
    Fields,
    FormBox,
    SubmitAndChangeVisibilityButton,
    UpdateRecordVisibilityButton
} from '@mpieva/psydb-ui-lib';

export const Component = (ps) => {
    var {
        title,
        crtSettings,
        initialValues,
        onSubmit,
        isTransmitting,

        record,        
        related,
        permissions,
        isAnonymized,

        renderFormBox = true,
        renderVisibilityButton = false,
    } = ps;

    var [{ translate }] = useI18N();

    // FIXME: i dont like how this works
    var wrappedOnSubmit = (formData, formikBag) => {
        var { forceDuplicate, setIsHidden, ...realData } = formData;
        
        var readOnlyFields = [
            ...crtSettings.fieldDefinitions.gdpr.filter(it => (
                it.props.readOnly
            )).map(it => ({ ...it, subChannelKey: 'gdpr' })),
            ...crtSettings.fieldDefinitions.scientific.filter(it => (
                it.props.readOnly
            )).map(it => ({ ...it, subChannelKey: 'scientific' })),
        ];
        for (var it of readOnlyFields) {
            delete realData[it.subChannelKey].custom[it.key];
        }
        return onSubmit(realData, formikBag, { forceDuplicate, setIsHidden });
    }

    var renderedForm = (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ wrappedOnSubmit }
            useAjvAsync
            enableReinitialize
        >
            {(formikProps) => (
                <>
                    { /*console.log(formikProps.values) || ''*/ }
                    <FormFields
                        record={ record }
                        crtSettings={ crtSettings }
                        related={ related }
                        permissions={ permissions }
                        isAnonymized={ isAnonymized }
                    />
                    <hr />
                    <div className='d-flex justify-content-between'>
                        <AsyncButton
                            type='submit'
                            isTransmitting={ isTransmitting }
                            disabled={ isAnonymized }
                        >
                            { translate('Save') }
                        </AsyncButton>
                        { (renderVisibilityButton && !isAnonymized) && (
                            <SubmitAndChangeVisibilityButton
                                record={ record }
                                formikForm={ formikProps }
                            />
                        )}
                    </div>
                </>
            )}
        </DefaultForm>
    );

    return (
        renderFormBox
        ? (
            <FormBox title={ title }>
                { renderedForm }
            </FormBox>
        )
        : renderedForm
    );
}

const FormFields = (ps) => {
    var { record, crtSettings, related, permissions, isAnonymized } = ps;
    var { requiresTestingPermissions } = crtSettings;
    
    var [{ translate }] = useI18N();

    return (
        <>
            <Fields.FullUserOrdered
                crtSettings={ crtSettings }
                related={ related }
                isAnonymized={ isAnonymized }
                disabled={ isAnonymized }
                exclude={[
                    '/sequenceNumber',
                    '/onlineId',
                    ...(!requiresTestingPermissions ? [
                        '/scientific/state/testingPermissions'
                    ] : []),
                    ...((
                        !permissions.hasFlag('canAccessSensitiveFields')
                        && crtSettings.commentFieldIsSensitive
                    ) ? [ '/scientific/state/comment' ] : [])
                ]}
                extraTypeProps={{
                    'PhoneWithTypeList': { enableParentNumbers: true },
                    'SubjectTestingPermissionList': {
                        required: true,
                        permissions
                    }
                }}
            />

            <Fields.AccessRightByResearchGroupList
                label={ translate('Record Access for') }
                dataXPath='$.scientific.systemPermissions.accessRightsByResearchGroup'
                related={ related }
                required={ true }
                disabled={ isAnonymized }
            />
        </>
    );
}
