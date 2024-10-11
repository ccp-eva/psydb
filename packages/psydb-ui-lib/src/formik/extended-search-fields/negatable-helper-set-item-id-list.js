import React from 'react';
import classnames from 'classnames';
import { withField } from '@cdxoo/formik-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Icons } from '@mpieva/psydb-ui-layout';
import * as CoreFields from '../fields';
import { PlainCheckbox } from './plain-checkbox';

export const NegatableHelperSetItemIdList = withField({ Control: (ps) => {
    var { dataXPath, formikField, formikForm, isNullable = false } = ps;
    var { setFieldValue } = formikForm;
    var { value } = formikField;
    var { any = false, negate = false, values } = value || {};

    var translate = useUITranslation();

    var onClickNoCondition = () => (
        setFieldValue(dataXPath, undefined)
    )
    var onClickSpecific = () => (
        setFieldValue(dataXPath, { any: false, negate: false, values: [] })
    );
    var onClickAny = () => (
        setFieldValue(dataXPath, { any: true, negate: false, values: [] })
    );
    var onClickNone = () => (
        setFieldValue(dataXPath, { any: true, negate: true, values: [] })
    );

    console.log(value);

    var activeTab = 'no-condition';
    if (value) {
        activeTab = 'specific';
    }
    if (any === true) {
        activeTab = 'any'
    }
    if (any === true && negate === true) {
        activeTab = 'none'
    }

    return (
        <div className='border p-3'>
            <div className='d-flex gapx-5 text-bold'>
                <Tab
                    onClick={ onClickNoCondition }
                    isActive={ activeTab === 'no-condition' }
                >
                    { translate('No Conditions') }
                </Tab>
                <Tab
                    onClick={ onClickSpecific }
                    isActive={ activeTab === 'specific' }
                >
                    { translate('Specific Values') }
                </Tab>
                <Tab
                    onClick={ onClickAny }
                    isActive={ activeTab === 'any' }
                >
                    { translate('Has Any Value') }
                </Tab>
                { isNullable && (
                    <Tab
                        onClick={ onClickNone }
                        isActive={ activeTab === 'none' }
                    >
                        { translate('Has No Value') }
                    </Tab>
                )}
            </div>
            { activeTab === 'specific' && (
                <>
                    <hr />
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
                </>
            )}
        </div>
    )
}});

const Tab = (ps) => {
    var { onClick, isActive, children } = ps;

    var className = classnames([
        'd-flex align-items-center',
        isActive ? 'text-primary' : 'text-muted'
    ]);

    return (
        <header role='button' className={ className } onClick={ onClick }>
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
