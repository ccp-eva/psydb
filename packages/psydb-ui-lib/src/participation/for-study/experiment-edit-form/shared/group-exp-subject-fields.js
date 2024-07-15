import React from 'react';

import {
    withField,
    withFieldArray
} from '../../../../formik';

import * as Fields from '../../form-fields';

const FullWidthSubjectId = withField({
    Control: Fields.ForeignId.Control,
    // FIXME: why does that not work as function?
    DefaultWrapper: 'NoneWrapper',
    //DefaultWrapper: ({ children }) => (<>{ children }</>),
})

const Control = (ps) => {
    var {
        dataXPath,
        subjectType,
        subjectConstraints,
    } = ps;

    return (
        <FullWidthSubjectId
            dataXPath={`${dataXPath}.subjectId`}
            collection='subject'
            recordType={ subjectType }
            constraints={ subjectConstraints }
        />
    )
}

const FieldComponent = withField({
    Control,
    DefaultWrapper: ({ children }) => (<>{ children }</>),
});

const GroupExpSubjectFields = withFieldArray({
    FieldComponent,
    //ArrayContentWrapper: 'ScalarArrayContentWrapper',
    ArrayItemWrapper: 'ScalarArrayItemWrapper',
    defaultItemValue: {
        status: 'participated',
        excludeFromMoreExperimentsInStudy: false
    }
})

export default GroupExpSubjectFields;
