import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { AsyncButton } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields, FormBox } from '@mpieva/psydb-ui-lib';

export const Component = (ps) => {
    var {
        title,
        fieldDefinitions,
        initialValues,
        onSubmit,
        isTransmitting,

        related,
        permissions,
    } = ps;

    var [{ translate }] = useI18N();

    return (
        <FormBox title={ title }>
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
                        <AsyncButton
                            type='submit'
                            isTransmitting={ isTransmitting }
                        >
                            { translate('Save') }
                        </AsyncButton>
                    </>
                )}
            </DefaultForm>
        </FormBox>
    );
}

const FormFields = (ps) => {
    var { fieldDefinitions, related, permissions } = ps;
    var [{ translate }] = useI18N();

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
                label={ translate('Record Access for') }
                dataXPath='$.systemPermissions.accessRightsByResearchGroup'
                related={ related }
                required
            />
        </>
    );
}
