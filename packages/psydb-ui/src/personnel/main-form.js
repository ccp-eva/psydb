import React from 'react';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    FormBox,
} from '@mpieva/psydb-ui-lib';

export const MainForm = (ps) => {
    var {
        title,
        initialValues,
        onSubmit,

        related,
        permissions,
    } = ps;

    return (
        <FormBox title={ title }>
            <DefaultForm
                initialValues={ initialValues }
                onSubmit={ onSubmit }
                useAjvAsync
            >
                {(formikProps) => (
                    <>
                        { console.log(formikProps.errors) || '' }
                        <FormFields
                            related={ related }
                            permissions={ permissions }
                        />
                        <Button type='submit'>Speichern</Button>
                    </>
                )}
            </DefaultForm>
        </FormBox>
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
            <Fields.SaneString
                label='Kürzel'
                dataXPath='$.gdpr.shorthand'
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
                        label='MA hat Admin-Zugriff'
                        dataXPath='$.scientific.hasRootAccess'
                        required
                    />
                </>
            )}
        </>
    );
}
