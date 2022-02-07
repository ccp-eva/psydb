import React, { useState } from 'react';
import classnames from 'classnames';
import { withField } from '@cdxoo/formik-utils';
import { Icons } from '@mpieva/psydb-ui-layout';
import * as CoreFields from '../fields';

export const DateOnlyServerSideInterval = withField({ Control: (ps) => {
    var { dataXPath, formikField, formikForm } = ps;
    var { value } = formikField;
    var { setFieldValue } = formikForm;
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
                Altersfenster
            </Header>
            <div className='d-flex'>
                <div className='w-50 flex-grow'>
                    <CoreFields.AgeFrameBoundary
                        dataXPath={ `${dataXPath}.ageFrame.start` }
                        label='Von'
                        disabled={ variant !== 'age' }
                    />
                </div>
                <div className='w-50 flex-grow'>
                    <CoreFields.AgeFrameBoundary
                        dataXPath={ `${dataXPath}.ageFrame.end` }
                        label='Bis'
                        disabled={ variant !== 'age' }
                    />
                </div>
            </div>
            <Header
                isActive={ variant === 'date' }
                onClick={ () => handleSwitchVariant('date') }
            >
                Datumsbereich
            </Header>
            <div className='d-flex'>
                <div className='w-50 flex-grow'>
                    <CoreFields.DateOnlyServerSide
                        dataXPath={ `${dataXPath}.interval.start` }
                        label='Von'
                        disabled={ variant !== 'date' }
                    />
                </div>
                <div className='w-50 flex-grow'>
                    <CoreFields.DateOnlyServerSide
                        dataXPath={ `${dataXPath}.interval.end` }
                        label='Bis'
                        disabled={ variant !== 'date' }
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
        'border-bottom pb-1 mb-2 text-bold',
        isActive ? 'text-primary' : 'text-muted'
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
