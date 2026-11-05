import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Fields, withField, withFieldArray, useFormikContext }
    from '@mpieva/psydb-ui-lib';

import CoreDefinitionAttributes from '../core';
import * as Options from '../common-options';
import * as NestableTypes from './index-nestable';

const ListOfObjectsFieldDefinition = withField({
    DefaultWrapper: 'NoneWrapper',
    Control: (ps) => {
        var { dataXPath, formikField, isUnrestricted } = ps;
        var { value } = formikField;
        var { type } = value;
    
        var TypeSpecific = NestableTypes[type];

        return (
            <>
                <CoreDefinitionAttributes
                    dataXPath={ dataXPath }
                    omittedFieldTypes={[ 'ListOfObjects' ]}
                    isUnrestricted={ isUnrestricted }
                />
                { TypeSpecific && (
                    <TypeSpecific
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
    var [{ translate }] = useI18N();

    return (
        <>
            <Options.MinItemsProp { ...ps  } />

            <ListOfObjectsFieldDefinitionList
                label={ translate('Sub List Fields') }
                dataXPath={ `${dataXPath}.props.fields` }
                isUnrestricted={ isUnrestricted }
            />
        </>
    )
}

