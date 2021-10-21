import React from 'react';

export const AddButtonWrapper = ({ children }) => (
    <div
        className='d-flex'
        style={{
            background: 'white',
            //background: '#006066',
            bottom: -24,
            left: -1,
            position: 'absolute',
        }}
    >
        { children }
    </div>
);

export const AddButton = ({
    children,
    onClick,
    disabled,
    style
}) => (
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

export const MoveButtonWrapper = ({ children }) => (
    <div
        className='d-flex'
        style={{
            background: 'white',
            bottom: -1,
            right: -1,
            position: 'absolute',
        }}
    >
        { children }
    </div>
);

export const MoveButton = ({ children, onClick, disabled }) => (
    <div
        role={ disabled ? '': 'button' }
        onClick={ disabled ? undefined : onClick }
        style={{
            color: disabled ? '#ccc' : '#006066',
            paddingTop: '3px',
            paddingBottom: '3px',
            width: '100px',
        }}
        className=' border d-flex align-items-center justify-content-center'
    >
        { children }
    </div>
)

export const RemoveButton = ({ children, onClick, disabled }) => (
    <div
        role={ disabled ? '': 'button' }
        onClick={ disabled ? undefined : onClick }
        className='border d-flex align-items-center justify-content-center'
        style={{
            color: disabled ? '#ccc' : '#c00',
            //border: '1px solid #c00',
            paddingTop: '3px',
            paddingBottom: '3px',
            width: '100px',
        }}
    >
        { children }
    </div>
)

