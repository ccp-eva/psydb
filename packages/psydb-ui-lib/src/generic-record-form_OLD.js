import React, { useState, useEffect, useReducer, forwardRef } from 'react';

import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import jsonpointer from 'jsonpointer';

import allSchemaCreators from '@mpieva/psydb-schema-creators';
import agent from '@mpieva/psydb-ui-request-agents';

import { SchemaForm } from './schema-form';

const GenericRecordForm = ({
    type,
    collection,
    recordType,
    id,
    additionalPayloadProps,
    onSuccessfulUpdate,
}) => {
    //console.log('form')
    //console.log(RJSFForm);

    type = type || 'create';

    var {
        hasSubChannels,
        hasCustomTypes,
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
        var messageAction = (
            type === 'edit'
            ? 'patch'
            : 'create'
        );
        var messageType = (
            hasCustomTypes
            ? `${collection}/${recordType}/${messageAction}`
            : `${collection}/${messageAction}`
        );

        var payload = (
            hasSubChannels
            ? {
                ...(type === 'edit' ? {
                    id,
                    lastKnownSubChannelEventIds: {
                        ...(record.scientific && {
                            scientific: record.scientific._lastKnownEventId,
                        }),
                        ...(record.gdpr && {
                            gdpr: record.gdpr._lastKnownEventId,
                        }),
                    }
                } : {}),
                props: formData,
                ...additionalPayloadProps,
            }
            : {
                ...(type === 'edit' ? {
                    id,
                    lastKnownEventId: record._lastKnownEventId,
                } : {}),
                props: formData,
                ...additionalPayloadProps,
            }
        )
        
        return agent.send({ message: {
            type: messageType,
            payload,
        }})
        .then(response => {
            var recordId = id;
            if (type !== 'edit') {
                var recordId = response.data.data.find(it => (
                    it.collectionName === collection
                )).channelId;
            }
            onSuccessfulUpdate && onSuccessfulUpdate({
                id: recordId,
                response
            });
        })
    };

    var formData = undefined;
    var formContext = {};
    if (record) {
        if (hasSubChannels) {
            formData = {
                ...(record.gdpr && {
                    gdpr: record.gdpr.state
                }),
                ...(record.scientific && {
                    scientific: record.scientific.state
                }),
            }
        }
        else {
            formData = record.state;
        }

        // FIXME:
        if (collection === 'experimentOperatorTeam') {
            delete formData.name;
        };

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
                ...( schema.properties.gdpr && {
                    gdpr: schema.properties.gdpr.properties.state,
                }),
                ...( schema.properties.scientific && {
                    scientific: schema.properties.scientific.properties.state,
                }),
            }
        }
        : schema.properties.state
    );

    return (
        <SchemaForm
            schema={ formSchema }
            formData={ formData }
            formContext={ formContext }
            onSubmit={ onSubmit }
        />
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
            if (record.gdpr && record.gdpr.state) {
                delete record.gdpr.state.internals;
            }
            if (record.scientific && record.scientific.state) {
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
