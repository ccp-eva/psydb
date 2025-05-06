import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import {
    withField, withFieldArray,
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

const LabMethodKeyList = withFieldArray({
    FieldComponent: CoreFields.LabMethodKey,
    ArrayItemWrapper: 'ScalarArrayItemWrapper',
    defaultItemValue: (ps) => '',
});

const withLogicGate = (bag) => {
    var { FieldComponent, defaultItemValue } = bag;

    var ValueList = withFieldArray({
        FieldComponent,
        ArrayItemWrapper: 'ScalarArrayItemWrapper',
        defaultItemValue,
    });

    var Complex = withField({ Control: (ps) => {
        var { dataXPath } = ps;
        var translate = useUITranslation();

        return (
            <div className='border pt-3 px-3'>
                <CoreFields.LogicGate
                    label={ translate('Logic Operation') }
                    dataXPath={ `${dataXPath}.logicGate` }
                />
                <ValueList
                    label={ translate('Values') }
                    dataXPath={ `${dataXPath}.values` }
                />
            </div>
        )
    }})

    return Complex;
}

const LabMethodKeyListWithLogicGate = withLogicGate({
    FieldComponent: CoreFields.LabMethodKey,
    defaultItemValue: (ps) => '',
})

export default {
    ...CoreFields,
    AgeFrameInterval,
    DateOnlyServerSideInterval,
    LabMethodKeyListWithLogicGate,
}
