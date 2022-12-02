import React from 'react';
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
                        <Button type='submit'>Speichern</Button>
                    </>
                )}
            </DefaultForm>
    );
}

const FormFields = (ps) => {
    var { related, permissions } = ps;
    return (
        <>
            <Fields.SaneString
                label='Vorname'
                dataXPath='$.gdpr.firstname'
                required
            />
            <Fields.SaneString
                label='Nachname'
                dataXPath='$.gdpr.lastname'
                required
            />
            <Fields.EmailWithPrimaryList
                label='Emails'
                dataXPath='$.gdpr.emails'
                required
            />
            <Fields.PhoneWithTypeList
                label='Telefon'
                dataXPath='$.gdpr.phones'
                required
            />
            
            <Fields.FullText
                label='Beschreibung'
                dataXPath='$.gdpr.description'
            />

            <Fields.ResearchGroupWithRoleList
                label='Forschungsgruppen'
                dataXPath='$.scientific.researchGroupSettings'
                related={ related }
                required
            />
            <Fields.AccessRightByResearchGroupList
                label='Zugriff auf diesen Datensatz für'
                dataXPath='$.scientific.systemPermissions.accessRightsByResearchGroup'
                related={ related }
                required
            />
            { permissions.isRoot() && (
                <>
                    <Fields.DefaultBool
                        label='Log-In erlauben'
                        dataXPath='$.scientific.canLogIn'
                        required
                    />
                    <Fields.DefaultBool
                        label='MA hat Admin-Zugriff'
                        dataXPath='$.scientific.hasRootAccess'
                        required
                    />
                </>
            )}
        </>
    );
}
