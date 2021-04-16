import React, { useState, useReducer } from 'react';
import { Button } from 'react-bootstrap';
import { withTheme } from '@rjsf/core';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4'

import agent from '@mpieva/psydb-ui-request-agents';

import FieldPointerListControl from '../field-pointer-list-control';

var schema = {
    type: 'object',
    properties: {
        format: {
            type: 'string' // FIXME: should be placeholder thingy
        },
        tokens: {
            type: 'array',
            items: { type: 'string' },
            default: [],
        }
    },
    required: [
        'format',
        'tokens'
    ]
}

var uiSchema = {
    tokens: {
        'ui:field': ({
            value,
            onChange,
            formContext,
            formData,
            ...other
        }) => {
            value = value || formData;
            console.log(value, formContext, formData);
            console.log(other);
            return <FieldPointerListControl
                value={ value }
                onChange={ onChange }
                availableFieldDataByPointer={
                    formContext.availableFieldDataByPointer
                }
            />
        }
    }
}

var SchemaForm = withTheme(Bootstrap4Theme);

const EditDefinitionForm = ({
    record,
    format,
    tokens,
    availableFieldDataByPointer,
    onSuccess,
}) => {

    var handleSubmit = ({ formData, ...unused }) => {
        var messageBody = {
            type: 'custom-record-types/set-record-label-definition',
            payload: {
                id: record._id,
                lastKnownEventId: record._lastKnownEventId,
                props: {
                    format: formData.format,
                    tokens: formData.tokens
                }
            }
        };
        return (
            agent.send({ message: messageBody })
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

    return (
        <SchemaForm
            schema={ schema }
            uiSchema={ uiSchema }
            formData={{
                format,
                tokens: tokens.map(it => it.dataPointer),
            }}
            formContext={{
                availableFieldDataByPointer,
            }}
            onSubmit={ handleSubmit }
        >
            <div>
                <Button type="submit" className="btn btn-primary">
                    Save
                </Button>
            </div>
        </SchemaForm>
    )
}



export default EditDefinitionForm;
