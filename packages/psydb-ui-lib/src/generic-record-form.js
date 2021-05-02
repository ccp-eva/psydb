import React, { useState, useEffect, useReducer, forwardRef } from 'react';

import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import jsonpointer from 'jsonpointer';

import allSchemaCreators from '@mpieva/psydb-schema-creators';
import agent from '@mpieva/psydb-ui-request-agents';

import { withTheme } from '@mpieva/rjsf-monkey-patch';
import RJSFCustomTheme from './rjsf-theme';

var SchemaForm = withTheme(RJSFCustomTheme);

const GenericRecordForm = ({
    type,
    collection,
    recordType,
    onSuccessfulUpdate,
}) => {
    //console.log('form')
    //console.log(RJSFForm);

    type = type || 'create';
    var id = undefined;
    if (type === 'edit') {
        ({ id } = useParams());
    }

    var {
        hasSubChannels,
        hasCustomRecordTypes,
    } = allSchemaCreators[collection];

    var [ state, dispatch ] = useReducer(reducer, {});
    var {
        record,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
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

    var onSubmit = ({ formData }) => {
        console.log('submitting');
        var messageAction = (
            type === 'edit'
            ? 'patch'
            : 'create'
        );
        var messageType = (
            hasCustomRecordTypes
            ? `${collection}/${recordType}/${messageAction}`
            : `${collection}/${messageAction}`
        );

        var payload = (
            hasSubChannels
            ? {
                ...(type === 'edit' ? {
                    id,
                    lastKnownSubChannelEventIds: {
                        scientific: record.scientific._lastKnownEventId,
                        gdpr: record.gdpr._lastKnownEventId,
                    }
                } : {}),
                props: formData
            }
            : {
                ...(type === 'edit' ? {
                    id,
                    lastKnownEventId: record._lastKnownEventId,
                } : {}),
                props: formData
            }
        )
        agent.send({ message: {
            type: messageType,
            payload,
        }})
    };

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
            relatedHelperSetItems,
            relatedCustomRecordTypeLabels,
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
            // FIXME: how to best remove additional stuff?
            var record = payload.record;
            if (record.state) {
                delete record.state.internals;
            }
            if (record.gdpr) {
                delete record.gdpr.state.internals;
            }
            if (record.scientific) {
                delete record.scientific.state.internals;
            }

            // TODO: depends on wther the editing user is root themselves
            // TODO: needs to be removed in the schema too
            /*if (record.scientific) {
                delete record.scientific.hasRootAccess;
            }*/

            return {
                ...state,
                record,
                relatedRecordLabels: payload.relatedRecordLabels,
                relatedHelperSetItems: payload.relatedHelperSetItems,
                relatedCustomRecordTypeLabels: payload.relatedCustomRecordTypeLabels,
            }
        case 'init-schema':
            return {
                ...state,
                schema: payload.schema
            }
    }
}

export default GenericRecordForm;
