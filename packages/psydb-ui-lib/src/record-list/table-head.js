import React, { useState, useEffect } from 'react';
import FieldDataHeadCols from './field-data-head-cols';

const TableHead = ({
    displayFieldData,
    showSelectionIndicator,
}) => {
    return (
        <thead>
            <tr>
                { showSelectionIndicator && (
                    <th></th>
                )}
                <FieldDataHeadCols displayFieldData={ displayFieldData } />
                <th></th>
            </tr>
        </thead>
    );
}

export default TableHead;
