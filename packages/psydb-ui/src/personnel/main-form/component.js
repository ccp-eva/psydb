import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    FormBox,
} from '@mpieva/psydb-ui-lib';

export const Component = (ps) => {
    var {
        title,
        initialValues,
        onSubmit,

        related,
        permissions,
    } = ps;

    var translate = useUITranslation();

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
                        />
                        <Button type='submit'>
                            { translate('Save') }
                        </Button>
                    </>
                )}
            </DefaultForm>
    );
}

const FormFields = (ps) => {
    var { related, permissions } = ps;
    var translate = useUITranslation();
    return (
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

            <Fields.ResearchGroupWithRoleList
                label={ translate('Research Groups') }
                dataXPath='$.scientific.researchGroupSettings'
                related={ related }
                required
            />
            <Fields.AccessRightByResearchGroupList
                label={ translate('Record Access for') }
                dataXPath='$.scientific.systemPermissions.accessRightsByResearchGroup'
                related={ related }
                required
            />
            { permissions.hasFlag('canAllowLogin') && (
                <>
                    <Fields.DefaultBool
                        label={ translate('Allow Log-In') }
                        dataXPath='$.scientific.canLogIn'
                        required
                    />
                </>
            )}
            { permissions.isRoot() && (
                <>
                    <Fields.DefaultBool
                        label={ translate('Has Admin Access') }
                        dataXPath='$.scientific.hasRootAccess'
                        required
                    />
                </>
            )}
        </>
    );
}
