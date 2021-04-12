import React, { useState, useReducer } from 'react';

const FieldPointerList = ({
    onMoveItem,
    onRemoveItem,
    dataPointers,
    availableFieldDataByPointer,
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
                    { availableFieldDataByPointer[dataPointer]
                        .displayName
                    }
                </li>
            ))}
        </ol>
    );
}

export default FieldPointerList;
