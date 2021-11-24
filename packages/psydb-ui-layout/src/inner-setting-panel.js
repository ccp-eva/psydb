import React from 'react';

import EditIconButton from './edit-icon-button';
import RemoveIconButton from './remove-icon-button';

export const InnerSettingPanel = (ps) => {
    var {
        label,
        children,

        showEditButton = true,
        showRemoveButton = true,
    } = ps;

    var showAnyButtons = showEditButton || showRemoveButton;

    return (
        <div className='p-3 mb-2 border d-flex justify-content-between align-items-start'>
            <div className='flex-grow-1 mr-4'>
                <header className='mb-2 border-bottom'>
                    <b>{ label }</b>
                </header>
                { children }
            </div>
            { showAnyButtons && (
                <Aside { ...ps } />
            )}
        </div>
    );
}

const Aside = (ps) => {
    var { 
        showEditButton = true,
        showRemoveButton = true,
        onEdit,
        onRemove
    } = ps;

    return (
        <div className='d-flex flex-column'>
            { showEditButton && (
                <EditIconButton className='mb-2' onClick={ onEdit } />
            )}
            { showRemoveButton && (
                <RemoveIconButton onClick={ onRemove } />
            )}
        </div>
    );
}
