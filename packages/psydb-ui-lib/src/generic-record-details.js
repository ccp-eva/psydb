import React, { useState, useEffect, useReducer, forwardRef } from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import allSchemaCreators from '@mpieva/psydb-schema-creators';
import agent from '@mpieva/psydb-ui-request-agents';

import { withTheme } from '@mpieva/rjsf-monkey-patch';
import { RJSFReadonlyTheme } from './schema-form';

import { LinkButton } from '@mpieva/psydb-ui-layout';

var SchemaForm = withTheme(RJSFReadonlyTheme);

const GenericRecordDetails = ({
    collection,
    recordType,
    id,
}) => {
    var { hasSubChannels } = allSchemaCreators[collection];

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
        })

        agent.readRecord({
            collection,
            recordType,
            id
        }).then((response) => {
            dispatch({ type: 'init-data', payload: {
                ...response.data.data
            }})
        })
    }, [ id, collection, recordType ])

    if (!schema || !record) {
        return (
            <div>Loading...</div>
        );
    }

    var formData = {};
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
            noHtml5Validate={ true }
            showErrorList={ false }
            schema={ formSchema }
            formData={ formData }
            formContext={ formContext }
        >
            <div></div>
        </SchemaForm>
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

export default GenericRecordDetails;
