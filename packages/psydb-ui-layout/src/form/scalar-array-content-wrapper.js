import React from 'react';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import * as Icons from '../icons';
import { ErrorIndicator } from './error-indicator';

export const ScalarArrayContentWrapper = (ps) => {
    var {
        formikArrayHelpers,
        itemsCount,
        defaultItemValue,
        disabled,
        children,

        className,
        extraClassName,
        fallbackLabel,

        extraContentWrapperProps = {},
    } = ps;

    var { readOnly = false } = extraContentWrapperProps;

    className = (
        className !== undefined
        ? className
        : classnames([
            'border p-3 mb-3', extraClassName
        ])
    );

    if (itemsCount < 1) {
        return <Fallback { ...ps } className={ className } />
    }

    return (
        <div>
            <ol className={ className }>
                { children }
                { !readOnly && (
                    <Footer { ...ps } />
                )}
            </ol>
        </div>
    );
}

const Fallback = (ps) => {
    var translate = useUITranslation();

    return (
        <div>
            <div className={ ps.className } style={{
                position: 'relative',
            }}>
                <div className='text-muted' style={{
                    paddingLeft: '15px',
                    opacity: ps.disabled ? 0.5 : 1
                }}>
                    <i>{ ps.fallbackLabel || translate('No Items') }</i>
                    <ErrorIndicator { ...ps } />
                </div>
            </div>
            { !ps.extraContentWrapperProps?.readOnly && (
                <Footer { ...ps } />
            )}
        </div>
    )
}

const Footer = ({ formikArrayHelpers, defaultItemValue, disabled }) => (
    <div className='mt-3'>
        <AddButton
            disabled={ disabled }
            onClick={ () => (
                formikArrayHelpers.push(defaultItemValue || '')
            )}
        >
            <Icons.Plus />
        </AddButton>
    </div>
)

const AddButton = (ps) => {
    var { children, onClick, style, disabled } = ps;
    var translate = useUITranslation();
    return (
        <button
            type='button'
            role={ disabled ? '': 'button' }
            onClick={ disabled ? undefined : onClick }
            style={{
                color: disabled ? '#ccc' : '#006066',
                paddingTop: '3px',
                paddingBottom: '3px',
                width: '100px',
                ...style,
            }}
            className=' border d-flex align-items-center justify-content-center bg-white'
            title={ translate('_form_array_add_button') }
        >
            { children }
        </button>
    )
}
