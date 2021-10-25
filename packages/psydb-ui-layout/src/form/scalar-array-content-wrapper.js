import React from 'react';
import { Button } from 'react-bootstrap';
import * as Icons from '../icons';

export const ScalarArrayContentWrapper = (ps) => {
    var {
        formikArrayHelpers,
        itemsCount,
        defaultItemValue,
        disabled,
        children
    } = ps;

    if (itemsCount < 1) {
        return <Fallback { ...ps } />
    }

    return (
        <div>
            <ol className='border p-3 mb-3'>
                { children }
                <Footer { ...ps } />
            </ol>
        </div>
    );
}

const Fallback = (ps) => (
    <div>
        <div className='border p-3 mb-3' style={{
            position: 'relative',
        }}>
            <div className='text-muted' style={{
                paddingLeft: '15px',
                opacity: ps.disabled ? 0.5 : 1
            }}>
                <i>Keine Einträge</i>
            </div>
            <Footer { ...ps } />
        </div>
    </div>
)

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
        className=' border d-flex align-items-center justify-content-center bg-white'
    >
        { children }
    </div>
)
