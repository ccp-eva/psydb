import React from 'react';
import { Button } from 'react-bootstrap';
import LoadingIndicator from './loading-indicator';

export const AsyncButton = (ps) => {
    var {
        onClick,
        isTransmitting = false,
        variant,
        disabled,
        children,

        ...pass
    } = ps;

    return (
        <div
            className='bs5 d-flex align-items-center'
            style={{ position: 'relative' }}
        >
            <Button
                { ...pass }
                onClick={ isTransmitting ? undefined : onClick }
                variant={ variant }
                //disabled={ disabled || isTransmitting }
                disabled={ disabled }
            >
                <span style={ isTransmitting ? { opacity: 0 } : undefined}>
                    { children }
                </span>
                <span style={{
                    width: '25px',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    marginLeft: 'auto',
                    marginRight: 'auto',
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
