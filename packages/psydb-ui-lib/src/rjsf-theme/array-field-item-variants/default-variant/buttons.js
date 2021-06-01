import React from 'react';

export const AddButtonWrapper = ({ children }) => (
    <div
        role='button'
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

export const AddButton = ({ children, onClick, style }) => (
    <div
        onClick={ onClick }
        style={{
            color: '#006066',
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
        role='button'
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

export const MoveButton = ({ children, onClick }) => (
    <div
        onClick={ onClick }
        style={{
            color: '#006066',
            paddingTop: '3px',
            paddingBottom: '3px',
            width: '100px',
        }}
        className=' border d-flex align-items-center justify-content-center'
    >
        { children }
    </div>
)

export const RemoveButton = ({ children, onClick }) => (
    <div
        className='border d-flex align-items-center justify-content-center'
        style={{
            color: '#c00',
            //border: '1px solid #c00',
            paddingTop: '3px',
            paddingBottom: '3px',
            width: '100px',
        }}
        onClick={ onClick }
    >
        { children }
    </div>
)

