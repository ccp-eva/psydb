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
        isFixedIndex,
    } = ps;

    return (
        <FullWidthSubjectId
            dataXPath={`${dataXPath}.subjectId`}
            collection='subject'
            recordType={ subjectType }
            constraints={ subjectConstraints }
            readOnly={ isFixedIndex }
        />
    )
}

const FieldComponent = withField({
    Control,
    // FIXME: why does this work here?????????
    // EDIT: oh its maybe because its never atually used in
    // defautl context but only in array context
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
