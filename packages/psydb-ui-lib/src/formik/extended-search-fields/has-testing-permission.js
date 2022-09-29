import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import * as enums from '@mpieva/psydb-schema-enums';
import * as CoreFields from '../fields';

export const HasTestingPermission = withField({ Control: (ps) => {
    var { formikForm, dataXPath } = ps;
    var { setFieldValue } = formikForm;
    return (
        <div className='border p-3'>
            <CoreFields.GenericEnum
                dataXPath={ `${dataXPath}.labMethod` }
                options={ enums.labMethods.mapping }
                alwaysIncludeEmptyOption
                label='Laborablauf'
            />
            <CoreFields.ForeignId
                collection='researchGroup'
                dataXPath={ `${dataXPath}.researchGroupId` }
                label='Forschungsgruppe'
            />
        </div>
    )
}});
