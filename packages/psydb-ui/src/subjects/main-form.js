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
        schema,
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
                        { /*console.log(formikProps.values) || ''*/ }
                        <FormFields
                            schema={ schema }
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
    var { schema, related, permissions } = ps;
    return (
        <>
            <Fields.Dynamic
                schema={ schema }
                subChannels={[ 'gdpr', 'scientific' ]}
                related={ related }
                extraTypeProps={{
                    'PhoneWithTypeList': { enableParentNumbers: true }
                }}
            />
            <Fields.SubjectTestingPermissionList
                label='Teilnahme-Erlaubnis'
                dataXPath='$.scientific.testingPermissions'
                related={ related }
                required
            />
            <Fields.AccessRightByResearchGroupList
                label='Zugriff auf diesen Datensatz für'
                dataXPath='$.scientific.systemPermissions.accessRightsByResearchGroup'
                related={ related }
                required
            />
            <Fields.FullText
                label='Kommentar'
                dataXPath='$.scientific.comment'
            />
        </>
    );
}
