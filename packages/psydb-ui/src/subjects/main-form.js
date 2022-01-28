import React from 'react';
import jsonpointer from 'jsonpointer';
import { convertPathToPointer } from '@mpieva/psydb-core-utils';
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
    var fieldSchemas = getCustomFieldSchemas({ schema, subChannels });
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
    switch (systemType) {
            // TODO: make sure that we dont need this mapping anymore
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

    var Component = Fields[systemType] || CustomFieldFallback;
    return (
        <Component
            dataXPath={ dataXPath }
            label={ title || dataXPath }
            required={ true }
            related={ related }
            { ...systemProps }
            { ...extraTypeProps[systemType] }
        />
    )
}

const getCustomFieldSchemas = (options = {}) => {
    var { schema, subChannels } = options;
    if (Array.isArray(subChannels) && subChannels.length > 1) {
        return subChannels.reduce((acc, key) => ({
            ...acc,
            ...getCustomFieldSchemas({ schema, subChannels: [ key ]})
        }), {})
    }
    else {
        var suffix = `properties.state.properties.custom.properties`;
        var path = (
            Array.isArray(subChannels)
            ? `properties.${subChannels[0]}.${suffix}`
            : suffix
        );
        //console.log(path);
        var fieldSchemas = jsonpointer.get(
            schema,
            convertPathToPointer(path)
        );
        //console.log({ fieldSchemas });
        if (!fieldSchemas || typeof fieldSchemas !== 'object') {
            throw new Error(`no field schemas found for path "${path}"`);
        }
        var out = Object.keys(fieldSchemas).reduce((acc, key) => {
            var dataXPath = (
                path
                .split('.')
                .filter(it => !(it == 'properties' || it === 'state'))
                .join('.')
            );
            return {
                ...acc,
                [`${dataXPath}.${key}`]: fieldSchemas[key]
            }
        }, {});

        //console.log({ out });
        return out;
    }
}
