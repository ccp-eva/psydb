import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import {
    Fields,
    withField,
    withFieldArray,
    useFormikContext
} from '@mpieva/psydb-ui-lib';

import { MinItemsProp } from './utility-fields';
import CoreDefinitions from './core-definitions';
import * as allBasicPropDefinitions from './basic-prop-definitions';

const ListOfObjectsFieldDefinition = withField({
    DefaultWrapper: 'NoneWrapper',
    Control: (ps) => {
        var { dataXPath, formikField, isUnrestricted } = ps;
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
                    isUnrestricted={ isUnrestricted }
                />
                { PropDefinitions && (
                    <PropDefinitions
                        dataXPath={ dataXPath }
                        isUnrestricted={ isUnrestricted }
                    />
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
    var { dataXPath, isUnrestricted } = ps;
    var translate = useUITranslation();
    return (
        <>
            <MinItemsProp { ...ps  } />
            <ListOfObjectsFieldDefinitionList
                label={ translate('Sub List Fields') }
                dataXPath={ `${dataXPath}.props.fields` }
                isUnrestricted={ isUnrestricted }
            />
        </>
    )
}

