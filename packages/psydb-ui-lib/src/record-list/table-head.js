import React, { useState, useEffect } from 'react';

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
                { displayFieldData.map(it => (
                    <th key={ it.key }>{ it.displayName }</th>
                ))}
                <th></th>
            </tr>
        </thead>
    );
}

export default TableHead;
