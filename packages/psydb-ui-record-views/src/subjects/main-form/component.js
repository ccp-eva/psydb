import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';
import {
    DefaultForm,
    Fields,
    FormBox,
    SubmitAndChangeVisibilityButton
} from '@mpieva/psydb-ui-lib';

export const Component = (ps) => {
    var {
        title,
        crtSettings,
        initialValues,
        onSubmit,

        record,        
        related,
        permissions,

        renderFormBox = true,
        renderVisibilityButton = false,
    } = ps;

    var translate = useUITranslation();

    // FIXME: i dont like how this works
    var wrappedOnSubmit = (formData, formikBag) => {
        var { forceDuplicate, setIsHidden, ...realData } = formData;
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
                        crtSettings={ crtSettings }
                        related={ related }
                        permissions={ permissions }
                    />
                    <hr />
                    <div className='d-flex justify-content-between'>
                        <Button type='submit'>
                            { translate('Save') }
                        </Button>
                        { renderVisibilityButton && (
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
                    'SubjectTestingPermissionList': {
                        required: true,
                        permissions
                    }
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
