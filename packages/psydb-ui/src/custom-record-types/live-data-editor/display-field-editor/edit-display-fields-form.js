import React, { useState, useReducer } from 'react';
import { Button } from 'react-bootstrap';
import agent from '@mpieva/psydb-ui-request-agents';

import FieldPointerListControl from '../field-pointer-list-control';

const EditDisplayFieldForm = ({
    target,
    record,
    currentDataPointers,
    availableFieldDataByPointer,
    onSuccess,
}) => {

    var [ state, setState ] = useState(currentDataPointers);

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

    var handleChange = (nextValue) => {
        setState(nextValue);
    }

    return (
        <>
        <FieldPointerListControl
            value={ state }
            onChange={ handleChange }
            availableFieldDataByPointer={
                availableFieldDataByPointer
            }
        />
        <Button onClick={ handleSaveChanges }>Speichern</Button>
        </>
    )
}



export default EditDisplayFieldForm;
