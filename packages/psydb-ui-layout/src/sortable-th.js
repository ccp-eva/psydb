import React from 'react';

export const SortableTH = (ps) => {
    var { label, sorter, path, isFirstCol = false } = ps;

    var onClick = () => sorter.setSort({
        sortPath: path,
        sortDirection: (
            sorter.sortPath === path
            ? ( sorter.sortDirection === 'asc' ? 'desc' : 'asc' )
            : isFirstCol && !sorter.sortPath ? 'desc' : 'asc'
        )
    })
    var isSelected = (
        path === sorter.sortPath
        ? true
        : false
    );

    return (
        <th
            onClick={ onClick }
            className='text-primary'
            style={{ cursor: 'pointer' }}
        >
            { 
                isSelected
                ? <u>{ label }</u>
                : label
            }
        </th>
    )
}
