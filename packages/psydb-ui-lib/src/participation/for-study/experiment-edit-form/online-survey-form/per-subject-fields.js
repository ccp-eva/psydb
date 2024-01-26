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
            <Fields.Timestamp
                dataXPath={`${dataXPath}.timestamp`}
            />
            <Fields.Status type='online-survey'
                dataXPath={`${dataXPath}.status`}
            />
            { enableFollowUpExperiments && (
                <Fields.DefaultBool
                    dataXPath='$.excludeFromMoreExperimentsInStudy'
                    label='Ist letzte Umfrage'
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
        excludeFromMoreExperimentsInStudy: false,
    }
})

export default PerSubjectFields;
