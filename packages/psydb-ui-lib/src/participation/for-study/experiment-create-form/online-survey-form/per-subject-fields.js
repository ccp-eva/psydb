import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

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

    var translate = useUITranslation();

    return (
        <div className=''>
            <Fields.ForeignId
                label={ translate('Subject') }
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
                    label={ translate('Last Survey?') }
                    dataXPath={
                        `${dataXPath}.excludeFromMoreExperimentsInStudy`
                    }
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
