import React from 'react';
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

const Fallback = (ps) => (
    <div>
        <div className='border p-3' style={{
            position: 'relative',
        }}>
            <div className='text-muted' style={{
                paddingLeft: '15px',
                opacity: ps.disabled ? 0.5 : 1
            }}>
                <i>Keine Einträge</i>
                <ErrorIndicator { ...ps } />
            </div>
        </div>
        <Footer { ...ps } />
    </div>
)

const Footer = ({ formikArrayHelpers, defaultItemValue, disabled }) => (
    <AddButtonWrapper>
        <AddButton
            disabled={ disabled }
            onClick={ () => (
                formikArrayHelpers.push(defaultItemValue || '')
            )}
        >
            <Icons.Plus />
        </AddButton>
    </AddButtonWrapper>
)

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

const AddButton = ({ children, onClick, style, disabled }) => (
    <div
        role={ disabled ? '': 'button' }
        onClick={ disabled ? undefined : onClick }
        style={{
            color: disabled ? '#ccc' : '#006066',
            paddingTop: '3px',
            paddingBottom: '3px',
            width: '100px',
            ...style,
        }}
        className=' border d-flex align-items-center justify-content-center'
    >
        { children }
    </div>
)
