import React, { useState, useReducer } from 'react';
import { Button } from 'react-bootstrap';
import agent from '@mpieva/psydb-ui-request-agents';

import FieldPointerSelector from './field-pointer-selector';
import FieldPointerList from './field-pointer-list';

const moveInsitu = (ary, fromIndex, toIndex) => {
    if (toIndex >= ary.length) {
        var k = toIndex - ary.length + 1;
        while (k--) {
            ary.push(undefined);
        }
    }
    ary.splice(toIndex, 0, ary.splice(fromIndex, 1)[0]);
};

const FieldPointerListControl = ({
    value,
    onChange,
    availableFieldDataByPointer,
}) => {

    var handleMoveItem = ({ from, to }) => {
        console.log(from, to);
        var clone = [ ...value ];
        moveInsitu(clone, from, to);
        onChange(clone);
    }

    var handleAddItem = (dataPointer) => {
        console.log(dataPointer);
        onChange([ ...value, dataPointer ]);
    }

    return (
        <>
        <FieldPointerList
            onMoveItem={ handleMoveItem }
            dataPointers={ value }
            availableFieldDataByPointer={
                availableFieldDataByPointer
            }
        />
        <hr />
        <FieldPointerSelector
            onSelect={ handleAddItem }
            selectedDataPointers={ value }
            availableFieldDataByPointer={
                availableFieldDataByPointer
            }
        />
        </>
    )
}

export default FieldPointerListControl;
