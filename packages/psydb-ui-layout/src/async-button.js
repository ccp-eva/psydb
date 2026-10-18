import React from 'react';
import { Button } from 'react-bootstrap';
import LoadingIndicator from './loading-indicator';

export const AsyncButton = (ps) => {
    var {
        type,
        onClick,
        onSubmit, // for convenicnce
        isTransmitting = false,
        variant,
        disabled,
        style,
        children,

        ...pass
    } = ps;

    if (type === 'submit') {
        onClick = undefined;
    }
    else {
        onClick = onClick || onSubmit;
    }

    return (
        <div
            className='bs5 d-flex align-items-center'
            style={{ position: 'relative' }}
        >
            <Button
                { ...pass }
                type={ isTransmitting ? 'button' : type }
                onClick={ isTransmitting ? undefined : () => onClick?.() }
                variant={ variant }
                style={{ position: 'relative', ...style }}
                //disabled={ disabled || isTransmitting }
                disabled={ disabled }
            >
                <span style={ isTransmitting ? { opacity: 0 } : undefined}>
                    { children }
                </span>
                <span style={{
                    position: 'absolute',
                    top: 0, bottom: 0, left: 0, right: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                }}>
                    { isTransmitting && (
                        <LoadingIndicator
                            asIcon={ true }
                            size='sm'
                            variant='white'
                            margin='0px'
                        />
                    )}
                </span>
            </Button>
        </div>
    )
}
