import React, { useState, useEffect } from 'react';

const FieldDataHeadCols = ({
    displayFieldData,
}) => {
    return (
        displayFieldData.map(it => (
            <th key={ it.key }>{ it.displayName }</th>
        ))
    );
}

export default FieldDataHeadCols;
