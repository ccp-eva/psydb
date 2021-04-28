import React, { useState, useEffect, useReducer } from 'react';
import { withTheme } from '@rjsf/core';
//import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4'

import RJSFCustomTheme from './rjsf-theme';

import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import allSchemaCreators from '@mpieva/psydb-schema-creators';
import agent from '@mpieva/psydb-ui-request-agents';

var SchemaForm = withTheme(RJSFCustomTheme);

const GenericRecordForm = ({
    type,
    collection,
    recordType,
    onSuccessfulUpdate,
}) => {
    type = type || 'create';
    var id = undefined;
    if (type === 'edit') {
        ({ id } = useParams());
    }

    var { hasSubChannels } = allSchemaCreators[collection];

    var [ state, dispatch ] = useReducer(reducer, {});
    var {
        record,
        relatedRecordLabels,
        relatedHelperSetItems,
        schema
    } = state;

    useEffect(() => {
        var suffix = `${collection}`;
        if (recordType) {
            suffix = `${suffix}/${recordType}`;
        }

        agent.readRecordSchema({
            collection,
            recordType
        }).then((response) => {
            dispatch({ type: 'init-schema', payload: {
                schema: response.data.data
            }})
            //setSchema(response.data.data);
        })

        if (type === 'edit') {
            agent.readRecord({
                collection,
                recordType,
                id
            }).then((response) => {
                dispatch({ type: 'init-data', payload: {
                    ...response.data.data
                }})
                //setRecord(response.data.data.record);
            })
        }
    }, [ type, id, collection, recordType ])

    if (!schema || (type === 'edit' && !record)) {
        return (
            <div>Loading...</div>
        );
    }

    // TODO
    var onSubmit = () => {};

    var formData = {};
    var formContext = {};
    if (record) {
        if (hasSubChannels) {
            formData = {
                gdpr: record.gdpr.state,
                scientific: record.scientific.state
            }
        }
        else {
            formData = record.state;
        }

        formContext = {
            relatedRecordLabels,
            relatedHelperSetItems
        }
    }

    var formSchema = (
        hasSubChannels
        ? {
            type: 'object',
            properties: {
                gdpr: schema.properties.gdpr.properties.state,
                scientific: schema.properties.scientific.properties.state
            }
        }
        : schema.properties.state
    );

    return (
        <div className='border p-3 bg-light'>
            <h5>
                { 
                    type === 'edit'
                    ? 'Datensatz bearbeiten'
                    : 'Neuer Datensatz'
                }
            </h5>
            <hr />
            <SchemaForm
                noHtml5Validate={ true }
                showErrorList={ false }
                schema={ formSchema }
                formData={ formData }
                formContext={ formContext }
                onSubmit={ onSubmit }
            >
                <div>
                    <Button type="submit" className="btn btn-primary">
                        Update
                    </Button>
                </div>
            </SchemaForm>
        </div>
    )
}

var reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init-data':
            return {
                ...state,
                record: payload.record,
                relatedRecordLabels: payload.relatedRecordLabels,
                relatedHelperSetItems: payload.relatedHelperSetItems
            }
        case 'init-schema':
            return {
                ...state,
                schema: payload.schema
            }
    }
}

export default GenericRecordForm;
