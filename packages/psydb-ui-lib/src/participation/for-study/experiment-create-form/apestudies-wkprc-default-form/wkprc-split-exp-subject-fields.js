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
        <div>
            <div className='d-flex'>
                <Fields.ForeignId
                    formGroupClassName='w-50 m-0'
                    uiSplit={[4,8]}
                    label={ translate('Subject') }
                    dataXPath={`${dataXPath}.subjectId`}
                    collection='subject'
                    recordType={ subjectType }
                    constraints={ subjectConstraints }
                    canClear={ false }
                    required
                />
                <Fields.DateOnlyTimestamp
                    formGroupClassName='w-50 m-0'
                    labelClassName='pl-5'
                    uiSplit={[4,8]}
                    dataXPath={`${dataXPath}.timestamp`}
                    required
                />
            </div>
            <div className='d-flex pt-2'>
                <Fields.SaneString
                    formGroupClassName='w-50 m-0'
                    uiSplit={[4,8]}
                    label={ translate('_wkprc_subjectRole') }
                    dataXPath={`${dataXPath}.role`}
                    required
                />
            </div>
            <div className='pt-2 pb-3 border-bottom'>
                <Fields.SaneString
                    uiSplit={[2,10]}
                    label={ translate('Comment') }
                    dataXPath={ `${dataXPath}.comment` }
                    formGroupClassName='m-0'
                />
            </div>
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
        comment: '',
        status: 'participated',
        excludeFromMoreExperimentsInStudy: false
    }
})

export default PerSubjectFields;
