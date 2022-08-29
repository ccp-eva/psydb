import React, { useState, useEffect } from 'react';
import { convertPointerToPath } from '@mpieva/psydb-core-utils';

const FieldDataHeadCols = ({
    displayFieldData,
    sorter
}) => {
    var createOnClick = (path) => (
        sorter
        ? () => sorter.setSort({
            sortPath: path,
            sortDirection: (
                sorter.sortPath === path
                ? ( sorter.sortDirection === 'asc' ? 'desc' : 'asc' )
                : 'asc'
            )
        })
        : undefined
    );
    return (
        displayFieldData.map(it => {
            //console.log(it);
            var { type, systemType, pointer, dataPointer } = it; 
            // FIXME
            pointer = pointer || dataPointer;
            type = type || systemType;

            var onClick = undefined;
            var className = undefined;
            var style = undefined;
            
            if ([
                'SaneString',
                'Address',
                'DateOnlyServerSide',
                'BiologicalGender',
                'Integer',
                'DateTime',
                'ExtBool'
            ].includes(type)) {
                //console.log(it);
                var path = convertPointerToPath(pointer);
                var isSelected = (
                    sorter && path === sorter.sortPath
                    ? true
                    : false
                );
                
                onClick = createOnClick(path);
                className = 'text-primary';
                style = { cursor: 'pointer' };
            }
            return (
                <th 
                    key={ it.key }
                    onClick={ onClick }
                    className={ className }
                    style={ style }
                >
                    { 
                        isSelected
                        ? <u>{ it.displayName }</u>
                        : it.displayName
                    }
                </th>
            );
        })
    );
}

export default FieldDataHeadCols;
