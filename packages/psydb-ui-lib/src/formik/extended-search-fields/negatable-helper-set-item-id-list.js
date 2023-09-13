import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import * as CoreFields from '../fields';
import { PlainCheckbox } from './plain-checkbox';

export const NegatableHelperSetItemIdList = withField({ Control: (ps) => {
    var { dataXPath } = ps;
    var translate = useUITranslation();
    return (
        <div className='border p-3'>
            <CoreFields.HelperSetItemIdList
                { ...ps }
                contentFallbackLabel={ translate('No Conditions') }
                contentClassName='m-0 p-0'
                noWrapper={ true }
                dataXPath={ `${dataXPath}.values` }
                label={ translate('Values') }
            />
            <hr />
            <PlainCheckbox
                dataXPath={ `${dataXPath}.negate` }
                label={ translate('Not with theese Values') }
            />
        </div>
    )
}});
