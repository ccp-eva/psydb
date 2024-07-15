import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import enums from '@mpieva/psydb-schema-enums';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import * as CoreFields from '../fields';

export const HasTestingPermission = withField({ Control: (ps) => {
    var { formikForm, dataXPath } = ps;
    var { setFieldValue } = formikForm;
    
    var translate = useUITranslation();
    
    return (
        <div className='border p-3'>
            <CoreFields.LabMethodKey
                dataXPath={ `${dataXPath}.labMethod` }
                alwaysIncludeEmptyOption
                label={ translate('Lab Workflow') }
            />
            <CoreFields.ForeignId
                collection='researchGroup'
                dataXPath={ `${dataXPath}.researchGroupId` }
                label={ translate('Research Group') }
            />
        </div>
    )
}});
