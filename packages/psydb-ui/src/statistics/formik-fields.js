import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import {
    withField,
    Fields as CoreFields
} from '@mpieva/psydb-ui-lib';

const AgeFrameInterval = withField({ Control: (ps) => {
    var { dataXPath } = ps;
    var translate = useUITranslation();

    return (
        <div className='border p-3'>
            <div className='d-flex'>
                <div className='w-50 flex-grow'>
                    <CoreFields.AgeFrameBoundary
                        dataXPath={ `${dataXPath}.start` }
                        label={ translate('_range_from') }
                        formGroupClassName='m-0'
                    />
                </div>
                <div className='w-50 flex-grow'>
                    <CoreFields.AgeFrameBoundary
                        dataXPath={ `${dataXPath}.end` }
                        label={ translate('_range_to') }
                        formGroupClassName='m-0'
                    />
                </div>
            </div>
        </div>
    )
}})

const DateOnlyServerSideInterval = withField({ Control: (ps) => {
    var { dataXPath } = ps;
    var translate = useUITranslation();

    return (
        <div className='border p-3'>
            <div className='d-flex'>
                <div className='w-50 flex-grow'>
                    <CoreFields.DateOnlyServerSide
                        dataXPath={ `${dataXPath}.start` }
                        label={ translate('_range_from') }
                        formGroupClassName='m-0'
                    />
                </div>
                <div className='w-50 flex-grow'>
                    <CoreFields.DateOnlyServerSide
                        dataXPath={ `${dataXPath}.end` }
                        label={ translate('_range_to') }
                        formGroupClassName='m-0'
                    />
                </div>
            </div>
        </div>
    )
}})

export default {
    ...CoreFields,
    AgeFrameInterval,
    DateOnlyServerSideInterval
}
