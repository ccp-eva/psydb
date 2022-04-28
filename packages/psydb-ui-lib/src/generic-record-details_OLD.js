import React, { useState, useEffect, useReducer, forwardRef } from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import allSchemaCreators from '@mpieva/psydb-schema-creators';
import agent from '@mpieva/psydb-ui-request-agents';

import { withTheme } from '@mpieva/rjsf-monkey-patch';
import { RJSFReadonlyTheme } from './schema-form';

import {
    useReadRecord
} from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    NotFound,
    LinkButton,
    Pair
} from '@mpieva/psydb-ui-layout';

var SchemaForm = withTheme(RJSFReadonlyTheme);

const GenericRecordDetails = ({
    collection,
    recordType,
    id,
}) => {
    var { hasSubChannels } = allSchemaCreators[collection];

    var [ didFetch, fetched ] = useReadRecord({
        collection,
        recordType,
        id,
        shouldFetchSchema: true,
        shouldFetchCRTSettings: false,
        extraAxiosConfig: { disableErrorModal: [ 404 ] }
    });

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { didReject, errorResponse } = fetched;
    if (didReject) {
        var { status } = errorResponse;
        if (status === 404) {
            return <NotFound />
        }
    }

    var {
        schema,
        record,
        related
    } = fetched;

    var {
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
    } = related;

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

    var {
        sequenceNumber,
        onlineId
    } = record;

    return (
        <div>
            { sequenceNumber && (
                <Pair 
                    label='ID Nr.'
                    wLeft={ 3 } wRight={ 9 } className='px-3'
                >
                    { sequenceNumber }
                </Pair>
            )}
            { onlineId && (
                <Pair 
                    label='Online ID Code'
                    wLeft={ 3 } wRight={ 9 } className='px-3'
                >
                    { onlineId }
                </Pair>
            )}
            <SchemaForm
                noHtml5Validate={ true }
                showErrorList={ false }
                schema={ formSchema }
                formData={ formData }
                formContext={ formContext }
            >
                <div></div>
            </SchemaForm>
        </div>
    )
}

export default GenericRecordDetails;
