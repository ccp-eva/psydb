import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import {
    withField,
    withFieldArray
} from '../../../../formik';

import * as Fields from '../../form-fields';

const Control = (ps) => {
    var {
        dataXPath,
        subjectType,
        subjectConstraints,
    } = ps;

    var translate = useUITranslation();

    return (
        <div className=''>
            <div className='mb-3'>
                <Fields.ForeignId
                    label={ translate('Subject') }
                    dataXPath={`${dataXPath}.subjectId`}
                    collection='subject'
                    recordType={ subjectType }
                    constraints={ subjectConstraints }
                    required
                />
            </div>
            <Fields.SaneString
                label={ translate('_wkprc_subjectRole') }
                dataXPath={`${dataXPath}.role`}
                required
            />
            <Fields.SaneString
                label={ translate('Comment') }
                dataXPath={`${dataXPath}.comment`}
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
    ArrayContentWrapper: 'ObjectArrayContentWrapper',
    ArrayItemWrapper: 'ObjectArrayItemWrapper',
    defaultItemValue: {
        status: 'participated',
        excludeFromMoreExperimentsInStudy: false
    }
})

export default PerSubjectFields;
