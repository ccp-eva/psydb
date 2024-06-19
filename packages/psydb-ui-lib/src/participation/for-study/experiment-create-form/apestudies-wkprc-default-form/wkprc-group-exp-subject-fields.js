import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

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

    var translate = useUITranslation();

    return (
        <>
            <div className='mb-3'>
                <FullWidthSubjectId
                    dataXPath={`${dataXPath}.subjectId`}
                    collection='subject'
                    recordType={ subjectType }
                    constraints={ subjectConstraints }
                    readOnly={ isFixedIndex }
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
        </>
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
        comment: '',
        status: 'participated',
        excludeFromMoreExperimentsInStudy: false
    }
})

export default GroupExpSubjectFields;
