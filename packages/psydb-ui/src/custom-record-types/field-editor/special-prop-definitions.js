import React from 'react';

import {
    Fields,
    withField,
    withFieldArray,
    useFormikContext
} from '@mpieva/psydb-ui-lib';

import CoreDefinitions from './core-definitions';
import * as allBasicPropDefinitions from './basic-prop-definitions';

const ListOfObjectsFieldDefinition = withField({
    DefaultWrapper: 'NoneWrapper',
    Control: (ps) => {
        var { dataXPath, formikField } = ps;
        var { value } = formikField;
        var { type } = value;
    
        var PropDefinitions = {
            ...allBasicPropDefinitions
        }[type];

        return (
            <>
                <CoreDefinitions
                    dataXPath={ dataXPath }
                    omittedFieldTypes={[ 'ListOfObjects' ]}
                    enableInternalKey
                />
                { PropDefinitions && (
                    <PropDefinitions dataXPath={ dataXPath } />
                )}
            </>
        )
    }
})

const ListOfObjectsFieldDefinitionList = withFieldArray({
    FieldComponent: ListOfObjectsFieldDefinition,
    ArrayContentWrapper: 'ObjectArrayContentWrapper',
    ArrayItemWrapper: 'ObjectArrayItemWrapper',
    defaultItemValue: { props: {}}
})

export const ListOfObjects = (ps) => {
    var { dataXPath } = ps;
    return (
        <>
            <ListOfObjectsFieldDefinitionList
                dataXPath={ `${dataXPath}.fields` }
            />
        </>
    )
}

