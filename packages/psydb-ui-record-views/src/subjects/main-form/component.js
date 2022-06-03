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
        crtSettings,
        initialValues,
        onSubmit,

        related,
        permissions,

        renderFormBox = true,
    } = ps;

    var renderedForm = (
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
                        crtSettings={ crtSettings }
                        related={ related }
                        permissions={ permissions }
                    />
                    <Button type='submit'>Speichern</Button>
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
    var { crtSettings, related, permissions } = ps;
    
    return (
        <>
            <Fields.FullUserOrdered
                crtSettings={ crtSettings }
                related={ related }
                exclude={[
                    '/sequenceNumber',
                    '/onlineId'
                ]}
                extraTypeProps={{
                    'PhoneWithTypeList': { enableParentNumbers: true },
                    'TestingPermissions': { required: true }
                }}
            />

            <Fields.AccessRightByResearchGroupList
                label='Zugriff auf diesen Datensatz für'
                dataXPath='$.scientific.systemPermissions.accessRightsByResearchGroup'
                related={ related }
                required
            />
        </>
    );
}
