import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { AsyncButton } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields, FormBox } from '@mpieva/psydb-ui-lib';

export const Component = (ps) => {
    var {
        title,
        initialValues,
        onSubmit,
        isTransmitting,

        related,
        permissions,
        isAnonymized
    } = ps;

    var [{ translate }] = useI18N();

    return (
            <DefaultForm
                initialValues={ initialValues }
                onSubmit={ onSubmit }
                useAjvAsync
                enableReinitialize
            >
                {(formikProps) => (
                    <>
                        { /*console.log(formikProps.values) || ''*/ }
                        <FormFields
                            related={ related }
                            permissions={ permissions }
                            isAnonymized={ isAnonymized }
                        />
                        <AsyncButton
                            type='submit'
                            isTransmitting={ isTransmitting }
                            disabled={ isAnonymized }
                        >
                            { translate('Save') }
                        </AsyncButton>
                    </>
                )}
            </DefaultForm>
    );
}

const FormFields = (ps) => {
    var { related, permissions, isAnonymized } = ps;
    var [{ translate }] = useI18N();

    return (
        <>
            { isAnonymized ? (
                <>
                    <b className='text-danger fs-3'>
                        { translate('Anonymized') }
                    </b>
                    <hr />
                </>
            ) : (
                <>
                    <Fields.SaneString
                        label={ translate('Firstname') }
                        dataXPath='$.gdpr.firstname'
                        required
                    />
                    <Fields.SaneString
                        label={ translate('Lastname') }
                        dataXPath='$.gdpr.lastname'
                        required
                    />
                    <Fields.EmailWithPrimaryList
                        label={ translate('E-Mails') }
                        dataXPath='$.gdpr.emails'
                        required
                    />
                    <Fields.PhoneWithTypeList
                        label={ translate('Phone') }
                        dataXPath='$.gdpr.phones'
                        required
                    />
                    <Fields.FullText
                        label={ translate('Description') }
                        dataXPath='$.gdpr.description'
                    />
                </>
            )}
            
            <Fields.ResearchGroupWithRoleList
                label={ translate('Research Groups') }
                dataXPath='$.scientific.researchGroupSettings'
                related={ related }
                required
                disabled={ isAnonymized }
            />
            <Fields.AccessRightByResearchGroupList
                label={ translate('Record Access for') }
                dataXPath='$.scientific.systemPermissions.accessRightsByResearchGroup'
                related={ related }
                required
                disabled={ isAnonymized }
            />
            { permissions.hasFlag('canAllowLogin') && (
                <>
                    <Fields.DefaultBool
                        label={ translate('Allow Log-In') }
                        dataXPath='$.scientific.canLogIn'
                        required
                        disabled={ isAnonymized }
                    />
                </>
            )}
            { permissions.isRoot() && (
                <>
                    <Fields.DefaultBool
                        label={ translate('Has Admin Access') }
                        dataXPath='$.scientific.hasRootAccess'
                        required
                        disabled={ isAnonymized }
                    />
                </>
            )}
        </>
    );
}
