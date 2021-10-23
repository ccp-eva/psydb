import React from 'react';
import { Button } from 'react-bootstrap';
import RemoveIconButton from './remove-icon-button';

export const OuterSettingPanel = (ps) => {
    var {
        label,
        children,

        showAddButton = true,
        showRemoveButton = true,
    } = ps;

    var showAnyButtons = showAddButton || showRemoveButton;

    return (
        <div className='bg-white border mb-2 position-relative'>
            <div className='p-3'>
                <header className='border-bottom pb-1 mb-3'>
                    <b>{ label }</b>
                </header>
                
                { children }
                
                { showAnyButtons && (
                    <>
                        <hr />
                        <Footer { ...ps } />
                    </>
                )}
            </div>
        </div>
    )
}

const Footer = (ps) => {
    var {
        showAddButton = true,
        showRemoveButton = true,
        onAdd,
        onRemove,
        addButtonLabel,
    } = ps;

    return (
        <div className='d-flex justify-content-between pr-3'>
            { showAddButton && ( 
                <Button size='sm' onClick={ onAdd }>
                    { addButtonLabel }
                </Button>
            )}
            { showRemoveButton && (
                <RemoveIconButton onClick={ onRemove } />
            )}
        </div>
    );
}
