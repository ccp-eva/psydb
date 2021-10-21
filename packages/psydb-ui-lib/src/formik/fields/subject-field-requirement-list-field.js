import React from 'react';
import {
    SubjectFieldRequirementField
} from './subject-field-requirement-field';

import WithFieldArray from '../with-field-array';

export const SubjectFieldRequirementListField = WithFieldArray({
    Control: (ps) => {
        var {
            dataXPath,
            formikField,
            formikMeta,
            formikForm,
            formikArrayHelpers,
            
            index,
            disabled,
            subjectScientificFields,
        } = ps;

        return (
            <SubjectFieldRequirementField { ...({
                index,
                dataXPath,
                formikArrayHelpers,
                subjectScientificFields,
                disabled,
            })} />
        )
    }
})
