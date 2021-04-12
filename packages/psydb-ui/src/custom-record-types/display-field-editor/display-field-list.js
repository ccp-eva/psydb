import React, { useState, useReducer } from 'react';

const DisplayFieldList = ({
    onMoveItem,
    onRemoveItem,
    dataPointers,
    availableDisplayFieldDataByDataPointer,
}) => {
    // TODO: andle move/remove
    if (dataPointers.length < 1) {
        return (
            <p>
                Keine Anzeigefelder festgelegt
            </p>
        )
    }

    return (
        <ol>
            { dataPointers.map(dataPointer => (
                <li key={dataPointer}>
                    { availableDisplayFieldDataByDataPointer[dataPointer]
                        .displayName
                    }
                </li>
            ))}
        </ol>
    );
}

export default DisplayFieldList;
