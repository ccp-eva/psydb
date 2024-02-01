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
        enableFollowUpExperiments,
        locationFieldDef,
        locationId,
        isFixedIndex,
    } = ps;

    var translate = useUITranslation();

    return (
        <div className=''>
            <Fields.ForeignId
                label={ translate('Subject') }
                dataXPath={`${dataXPath}.subjectId`}
                collection='subject'
                recordType={ subjectType }
                constraints={{
                    [locationFieldDef.pointer]: locationId
                }}
                readOnly={ isFixedIndex }
            />
            <Fields.Status type='away-team'
                dataXPath={`${dataXPath}.status`}
            />
            { enableFollowUpExperiments && (
                <Fields.DefaultBool
                    label={ translate('Last Appointment?') }
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
        excludeFromMoreExperimentsInStudy: false
    }
})

export default PerSubjectFields;
