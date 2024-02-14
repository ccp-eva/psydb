import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    FormBox,

    withField,
    withFieldArray,
} from '@mpieva/psydb-ui-lib';

export const MainForm = (ps) => {
    var {
        title,
        initialValues,
        onSubmit,

        related,
        permissions,
    } = ps;

    var translate = useUITranslation();

    return (
        <FormBox title={ title }>
            <DefaultForm
                initialValues={ initialValues }
                onSubmit={ onSubmit }
                useAjvAsync
            >
                {(formikProps) => (
                    <>
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
        </FormBox>
    );
}

const FormFields = (ps) => {
    var { related, permissions } = ps;
    var translate = useUITranslation();
    return (
        <>
            <Fields.SaneString
                label={ translate('_designation') }
                dataXPath='$.name'
                required
            />
            <Fields.SaneString
                label={ translate('Shorthand') }
                dataXPath='$.shorthand'
                required
            />
            <Fields.Address
                label={ translate('Address') }
                dataXPath='$.address'
            />
            <Fields.FullText
                label={ translate('Description') }
                dataXPath='$.description'
            />
            
            <hr />

            <AssignedTypeList
                label={ translate('Study Types') }
                collection='study'
                dataXPath='$.studyTypes'
            />

            <AssignedTypeList
                label={ translate('Subject Types') }
                collection='subject'
                dataXPath='$.subjectTypes'
            />

            <AssignedTypeList
                label={ translate('Location Types') }
                collection='location'
                dataXPath='$.locationTypes'
            />
            
            <AssignedHelperSetList
                label={ translate('Helper Tables') }
                dataXPath='$.helperSetIds'
            />

            <Fields.LabMethodKeyList
                label={ translate('Lab Workflows') }
                dataXPath='$.labMethods'
            />
            
            <Fields.ForeignIdList
                label={ translate('System Roles') }
                dataXPath='$.systemRoleIds'
                collection='systemRole'
            />
            <Fields.ForeignId
                label={ translate('Admin Fallback System Role') }
                dataXPath='$.adminFallbackRoleId'
                collection='systemRole'
            />
        </>
    );
}

var GenericTypeKey = withField({
    Control: Fields.GenericTypeKey.Control,
    DefaultWrapper: 'NoneWrapper',
});

var AssignedType = withField({
    Control: (ps) => {
        var { collection, dataXPath } = ps;
        return (
            <GenericTypeKey
                collection={ collection }
                dataXPath={ `${dataXPath}.key` }
            />
        )
    },
    DefaultWrapper: 'NoneWrapper',
});

var AssignedTypeList = withFieldArray({
    FieldComponent: AssignedType,
    //ArrayContentWrapper: 'ObjectArrayContentWrapper',
    //ArrayItemWrapper: 'ObjectArrayItemWrapper',
    ArrayItemWrapper: 'ScalarArrayItemWrapper',
});

var AssignedHelperSetId = withField({
    Control: Fields.HelperSetId.Control,
    DefaultWrapper: 'NoneWrapper',
});

var AssignedHelperSetList = withFieldArray({
    FieldComponent: AssignedHelperSetId,
    //ArrayContentWrapper: 'ObjectArrayContentWrapper',
    //ArrayItemWrapper: 'ObjectArrayItemWrapper',
    ArrayItemWrapper: 'ScalarArrayItemWrapper',
});
