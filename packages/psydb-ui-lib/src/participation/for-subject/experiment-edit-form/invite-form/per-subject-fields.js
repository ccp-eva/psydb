import React from 'react';

import {
    withField,
    withFieldArray
} from '../../../../formik';

import * as Fields from '../form-fields/fields';

const Control = (ps) => {
    var {
        dataXPath,
        subjectType,
        enableFollowUpExperiments
    } = ps;

    return (
        <div className=''>
            <Fields.ForeignId
                label='Proband:in'
                dataXPath={`${dataXPath}.subjectId`}
                collection='subject'
                recordType={ subjectType }
            />
            <Fields.Status type='invite'
                dataXPath={`${dataXPath}.status`}
            />
            { enableFollowUpExperiments && (
                <Fields.DefaultBool
                    dataXPath='$.excludeFromMoreExperimentsInStudy'
                    label='Ist Letzter Termin'
                />
            )}
        </div>
    )
}

const FieldComponent = withField({
    Control,
    DefaultWrapper: ({ children }) => (<>{ children }</>),
});

const PerSubjectFields = withFieldArray({
    FieldComponent,
    ArrayContentWrapper: 'ObjectArrayContentWrapper',
    ArrayItemWrapper: 'ObjectArrayItemWrapper',
    defaultItemValue: {
        status: 'participated',
        excludeFromMoreExperimentsInStudy: false
    }
})

export default PerSubjectFields;
