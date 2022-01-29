import React from 'react';
import jsonpointer from 'jsonpointer';
import { gatherCustomFieldSchemas } from '@mpieva/psydb-common-lib';

import * as Fields from './static';

/*
    <Fields.Dynamic
        //definitions={ definitions }
        schema={ schema }
        subChannels={[ 'gdpr', 'scientific' ]}
        related={ related }
        extraTypeProps={{
            'PhoneWithTypeList': { enableParentNumbers: true }
        }}
    />
*/

// TODO: make custom fields based on crt field list instead of schema
export const Dynamic = (ps) => {
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

