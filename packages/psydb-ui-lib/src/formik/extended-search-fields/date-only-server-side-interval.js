import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import * as CoreFields from '../fields';

export const DateOnlyServerSideInterval = withField({ Control: (ps) => {
    var { dataXPath } = ps;
    return (
        <div className='border p-3'>
            <header className='border-bottom pb-1 mb-2'>Datumsbereich</header>
            <div className='d-flex'>
                <div className='w-50 flex-grow'>
                    <CoreFields.DateOnlyServerSide
                        dataXPath={ `${dataXPath}.interval.start` }
                        label='Von'
                    />
                </div>
                <div className='w-50 flex-grow'>
                    <CoreFields.DateOnlyServerSide
                        dataXPath={ `${dataXPath}.interval.end` }
                        label='Bis'
                    />
                </div>
            </div>
            <header className='border-bottom pb-1 mb-2'>Altersbereich</header>
            <div className='d-flex'>
                <div className='w-50 flex-grow'>
                    <CoreFields.AgeFrameBoundary
                        dataXPath={ `${dataXPath}.ageFrame.start` }
                        label='Von'
                    />
                </div>
                <div className='w-50 flex-grow'>
                    <CoreFields.AgeFrameBoundary
                        dataXPath={ `${dataXPath}.ageFrame.end` }
                        label='Bis'
                    />
                </div>
            </div>
        </div>
    )
}});
