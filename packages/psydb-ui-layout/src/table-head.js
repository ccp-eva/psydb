import React from 'react';

export const TableHead = (ps) => {
    var {
        children,
        showActionColumn = false,
        showSelectionIndicator = false,
    } = ps;

    return (
        <thead>
            <tr className='bg-white'>
                { showSelectionIndicator && <th></th> }
                { children }
                { showActionColumn && <th></th> }
            </tr>
        </thead>
    )
}

