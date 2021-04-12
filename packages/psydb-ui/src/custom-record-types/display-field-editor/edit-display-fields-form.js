import React, { useState, useReducer } from 'react';
import { Button } from 'react-bootstrap';
import agent from '@mpieva/psydb-ui-request-agents';

import DisplayFieldSelector from './display-field-selector';
import DisplayFieldList from './display-field-list';

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
    record,
    currentDataPointers,
    availableDisplayFieldDataByDataPointer,
    onSuccess,
}) => {
    target = target || 'table';

    var [ state, dispatch ] = useReducer(
        reducer,
        currentDataPointers
    );

    var handleSaveChanges = () => {
        var messageBody = {
            type: 'custom-record-types/set-display-fields',
            payload: {
                target,
                id: record._id,
                lastKnownEventId: record._lastKnownEventId,
                fieldPointers: state,
            }
        };
        return (
            agent.post('/api/', messageBody)
            .then(
                (response) => {
                    onSuccess()
                },
                (error) => {
                    console.log('ERR:', error)
                    alert('TODO')
                }
            )
        ) 
    }

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
        <Button onClick={ handleSaveChanges }>Speichern</Button>
        </>
    )
}



export default EditDisplayFieldForm;
