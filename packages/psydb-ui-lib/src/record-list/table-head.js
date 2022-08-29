import React, { useState, useEffect } from 'react';
import { Pagination } from '@mpieva/psydb-ui-layout';

import FieldDataHeadCols from './field-data-head-cols';

const TableHead = ({
    displayFieldData,
    showSelectionIndicator,
    pagination,
    sorter,
}) => {
    /*<thead className='sticky-top bg-light'>*/
    return (
        <thead>
            {/*<tr className='bg-light'>
                <td className='m-0 p-0' colSpan={
                    displayFieldData.length + 1 + (showSelectionIndicator ? 1 : 0)
                }>
                    <Pagination { ...pagination } />
                </td>
            </tr>*/}
            <tr className='bg-white'>
                { showSelectionIndicator && (
                    <th></th>
                )}
                <FieldDataHeadCols
                    displayFieldData={ displayFieldData }
                    sorter={ sorter }
                />
                <th></th>
            </tr>
        </thead>
    );
}

export default TableHead;
