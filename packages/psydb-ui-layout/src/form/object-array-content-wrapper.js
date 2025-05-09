import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import * as Icons from '../icons';
import { ErrorIndicator } from './error-indicator';

export const ObjectArrayContentWrapper = (ps) => {
    var {
        formikArrayHelpers,
        itemsCount,
        defaultItemValue,
        disabled,
        children
    } = ps;

    if (itemsCount < 1) {
        return (
            <Fallback { ...ps } />
        )
    }

    return (
        <div>
            <ErrorIndicator { ...ps } />
            { children }
            <Footer { ...ps } />
        </div>
    );
}

const Fallback = (ps) => {
    var { disabled } = ps;
    var translate = useUITranslation();
    
    return (
        <div>
            <div className='border p-3' style={{
                position: 'relative',
            }}>
                <div className='text-muted' style={{
                    paddingLeft: '15px',
                    opacity: disabled ? 0.5 : 1
                }}>
                    <i>{ translate('No Items') }</i>
                    <ErrorIndicator { ...ps } />
                </div>
            </div>
            <Footer { ...ps } />
        </div>
    );
}

const Footer = (ps) => {
    var {
        formikArrayHelpers, defaultItemValue, disabled,
        enableAdd = true
    } = ps;

    return (
        <AddButtonWrapper>
            { enableAdd && (
                <AddButton
                    disabled={ disabled }
                    onClick={ () => (
                        formikArrayHelpers.push(defaultItemValue || '')
                    )}
                >
                    <Icons.Plus />
                </AddButton>
            )}
        </AddButtonWrapper>
    );
}

const AddButtonWrapper = ({ children }) => (
    <div
        className='d-flex mb-3'
        style={{ marginTop: '-1px' }}
    >
        <div className='bg-white'>
            { children }
        </div>
    </div>
);

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
