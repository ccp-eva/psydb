import React from 'react';
import { withField, withFieldArray } from '@cdxoo/formik-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { CustomField } from './custom-field';

const ListOfObjectsFieldItem = withField({
    DefaultWrapper: 'NoneWrapper',
    Control: (ps) => {
        var { dataXPath, definition, related, extraTypeProps = {}} = ps;
        var { fields } = definition.props;

        return (
            fields.map((it, ix) => (
                <CustomField
                    key={ ix }
                    dataXPath={ `${dataXPath}.${it.key}` }
                    definition={ it }
                    related={ related }
                    extraTypeProps={ extraTypeProps }
                />
            ))
        )
    }
})

const ListOfObjectsInternal = withFieldArray({
    FieldComponent: ListOfObjectsFieldItem,
    ArrayContentWrapper: 'ObjectArrayContentWrapper',
    ArrayItemWrapper: 'ObjectArrayItemWrapper',
    defaultItemValue: {}
})

export const ListOfObjectsField = (ps) => {
    var { definition } = ps;
    
    var translate = useUITranslation();
    var label = translate.fieldDefinition(definition);
    
    return (
        <ListOfObjectsInternal label={ label } { ...ps } />
    )
}
