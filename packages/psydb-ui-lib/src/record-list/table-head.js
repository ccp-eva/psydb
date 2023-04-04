import React from 'react';
import FieldDataHeadCols from './field-data-head-cols';

const TableHead = (ps) => {
    var {
        displayFieldData,
        sorter,
        showActionColumn = true,
        showSelectionIndicator = false,
        canSort = false,
    } = ps;

    return (
        <thead>
            <tr className='bg-white'>
                { showSelectionIndicator && (
                    <th></th>
                )}
                <FieldDataHeadCols
                    displayFieldData={ displayFieldData }
                    sorter={ sorter }
                    canSort={ canSort }
                />
                { showActionColumn && (
                    <th></th>
                )}
            </tr>
        </thead>
    );
}

export default TableHead;
