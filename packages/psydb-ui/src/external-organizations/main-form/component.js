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
        fieldDefinitions,
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
                            fieldDefinitions={ fieldDefinitions }
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
    var { fieldDefinitions, related, permissions } = ps;
    var customFieldBag = {
        fieldDefinitions,
        related,
        extraTypeProps: {
            'PhoneWithTypeList': { enableFaxNumbers: true }
        }
    }
    return (
        <>
            <Fields.Custom { ...customFieldBag } />
            <Fields.AccessRightByResearchGroupList
                label='Zugriff auf diesen Datensatz für'
                dataXPath='$.systemPermissions.accessRightsByResearchGroup'
                related={ related }
                required
            />
        </>
    );
}
