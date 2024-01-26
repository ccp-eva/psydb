import React from 'react';

import {
    withField,
    withFieldArray
} from '../../../../formik';

import * as Fields from '../../form-fields';

const Control = (ps) => {
    var {
        dataXPath,
        subjectType,
    } = ps;

    return (
        <div className='d-flex'>
            <Fields.ForeignId
                formGroupClassName='w-50 m-0'
                uiSplit={[4,8]}
                label='Proband:in'
                dataXPath={`${dataXPath}.subjectId`}
                collection='subject'
                recordType={ subjectType }
            />
            <Fields.Timestamp
                formGroupClassName='w-50 m-0'
                labelClassName='text-center'
                uiSplit={[4,8]}
                dataXPath={`${dataXPath}.timestamp`}
            />
        </div>
    )
}

const FieldComponent = withField({
    Control,
    DefaultWrapper: ({ children }) => (<>{ children }</>),
});

const PerSubjectFields = withFieldArray({
    FieldComponent,
    //ArrayContentWrapper: 'ScalarArrayContentWrapper',
    ArrayItemWrapper: 'ScalarArrayItemWrapper',
    defaultItemValue: {
        status: 'participated',
        excludeFromMoreExperimentsInStudy: false
    }
})

export default PerSubjectFields;
