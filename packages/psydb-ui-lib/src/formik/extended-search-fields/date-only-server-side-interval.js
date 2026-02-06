import React, { useState } from 'react';
import classnames from 'classnames';
import { withField } from '@cdxoo/formik-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Icons } from '@mpieva/psydb-ui-layout';
import * as CoreFields from '../fields';

export const DateOnlyServerSideInterval = withField({ Control: (ps) => {
    var { dataXPath, formikField, formikForm } = ps;
    var { value } = formikField;
    var { setFieldValue } = formikForm;
    
    var translate = useUITranslation();
    
    var [ variant, setVariant ] = useState(
        value && value.interval ? 'date': 'age'
    );

    var handleSwitchVariant = (key) => {
        setFieldValue(dataXPath, undefined);
        setVariant(key);
    }

    return (
        <div className='border p-3'>
            <Header
                isActive={ variant === 'age' }
                onClick={ () => handleSwitchVariant('age') }
            >
                { translate('Age Range') }
            </Header>
            <div className='d-flex'>
                <div className='w-50 flex-grow'>
                    <CoreFields.AgeFrameBoundary
                        dataXPath={ `${dataXPath}.ageFrame.start` }
                        label={ translate('_range_from') }
                        disabled={ variant !== 'age' }
                    />
                </div>
                <div className='w-50 flex-grow'>
                    <CoreFields.AgeFrameBoundary
                        dataXPath={ `${dataXPath}.ageFrame.end` }
                        label={ translate('_range_to') }
                        disabled={ variant !== 'age' }
                    />
                </div>
            </div>
            <Header
                isActive={ variant === 'date' }
                onClick={ () => handleSwitchVariant('date') }
            >
                { translate('Date Range') }
            </Header>
            <div className='d-flex'>
                <div className='w-50 flex-grow'>
                    <CoreFields.DateOnlyServerSide
                        dataXPath={ `${dataXPath}.interval.start` }
                        label={ translate('_range_from') }
                        disabled={ variant !== 'date' }
                        formGroupClassName='mb-0'
                    />
                </div>
                <div className='w-50 flex-grow'>
                    <CoreFields.DateOnlyServerSide
                        dataXPath={ `${dataXPath}.interval.end` }
                        label={ translate('_range_to') }
                        disabled={ variant !== 'date' }
                        formGroupClassName='mb-0'
                    />
                </div>
            </div>
        </div>
    )
}});

const Header = (ps) => {
    var { isActive, onClick, children } =ps;
    var className = classnames([
        'd-flex align-items-center',
        'border-bottom pb-1 mb-2',
        isActive ? 'text-primary' : ''
    ]);
    var role = (
        'button'
        //isActive ? '' : 'button'
    );
    return (
        <header role={ role } className={ className } onClick={ onClick }>
            { isActive
                ? <Icons.CheckSquareFill />
                : <Icons.Square />
            }
            <span className='ml-2'>
                { children }
            </span>
        </header>
    )
}
