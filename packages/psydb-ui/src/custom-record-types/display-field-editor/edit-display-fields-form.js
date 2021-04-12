import React, { useState, useReducer } from 'react';

import DisplayFieldSelector from './display-field-selector';

const moveInsitu = (ary, fromIndex, toIndex) => {
    if (toIndex >= ary.length) {
        var k = toIndex - ary.length + 1;
        while (k--) {
            ary.push(undefined);
        }
    }
    ary.splice(toIndex, 0, ary.splice(fromIndex, 1)[0]);
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'move':
            var { from, to } = action.payload;
            var clone = [ ...state ];
            moveInsitu(clone, from, to);
            return clone;
        case 'add':
            var { item } = action.payload;
            return [ ...state, item ];
        default:
            throw new Error('unkown action type')
    }
}

const EditDisplayFieldForm = ({
    target,
    currentDataPointers,
    availableDisplayFieldDataByDataPointer,
    onSuccess,
}) => {

    var [ state, dispatch ] = useReducer(
        reducer,
        currentDataPointers
    );

    var handleMoveItem = ({ from, to }) => {
        console.log(from, to);
        dispatch({
            type: 'move',
            payload: { from, to }
        });
    }

    var handleAddItem = (dataPointer) => {
        console.log(dataPointer);
        dispatch({
            type: 'add',
            payload: { item: dataPointer }
        })
    }

    console.log(state);

    return (
        <>
        <DisplayFieldList
            onMoveItem={ handleMoveItem }
            dataPointers={ state }
            availableDisplayFieldDataByDataPointer={
                availableDisplayFieldDataByDataPointer
            }
        />
        <hr />
        <DisplayFieldSelector
            onSelect={ handleAddItem }
            selectedDataPointers={ state }
            availableDisplayFieldDataByDataPointer={
                availableDisplayFieldDataByDataPointer
            }
        />
        </>
    )
}


const DisplayFieldList = ({
    onMoveItem,
    onRemoveItem,
    dataPointers,
    availableDisplayFieldDataByDataPointer,
}) => {
    if (dataPointers.length < 1) {
        return (
            <div>
                Keine Anzeigefelder festgelegt
            </div>
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

export default EditDisplayFieldForm;
