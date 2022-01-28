import React from 'react';
import jsonpointer from 'jsonpointer';
import { gatherCustomFieldSchemas } from '@mpieva/psydb-common-lib';
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
            <CustomFields
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
        </>
    );
}

// TODO: make custom fields based on crt field list instead of schema
const CustomFields = (ps) => {
    var { schema, subChannels, related, extraTypeProps } = ps;
    //console.log(schema);
    var fieldSchemas = gatherCustomFieldSchemas({ schema, subChannels });
    console.log(fieldSchemas);

    return (
        <>
            { Object.keys(fieldSchemas).map(path => (
                <CustomField
                    key={ path }
                    dataXPath={`$.${path}`}
                    schema={ fieldSchemas[path] }
                    related={ related }
                    extraTypeProps={ extraTypeProps }
                />
            ))}
        </>
    )
}

const CustomFieldFallback = (ps) => {
    var { dataXPath, systemType } = ps;
    return (
        <div className='text-danger'>{ dataXPath }: { systemType } }</div>
    )
}
const fixSystemType = (systemType) => {
    // TODO: make sure that we dont need this mapping anymore
    switch (systemType) {
        case 'EmailList':
            return 'EmailWithPrimaryList';
        case 'PhoneList':
            return 'PhoneWithTypeList';
        default:
            return systemType;
    }
};
const CustomField = (ps) => {
    var { dataXPath, schema, related, extraTypeProps } = ps;
    var { systemType, title, systemProps } = schema;

    systemType = fixSystemType(systemType);
    var isRequired = true;
    switch (systemType) {
        case 'SaneString':
            // TODO: use crt definition instead
            isRequired = !!schema.allOf.find(it => it.minLength > 0);
            break;
    }

    var Component = Fields[systemType] || CustomFieldFallback;
    return (
        <Component
            dataXPath={ dataXPath }
            label={ title || dataXPath }
            required={ isRequired }
            related={ related }
            { ...systemProps }
            { ...extraTypeProps[systemType] }
        />
    )
}

