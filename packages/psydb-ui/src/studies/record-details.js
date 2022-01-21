import React, { useState, useEffect, useReducer, forwardRef } from 'react';

import { useRouteMatch, useParams } from 'react-router-dom';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import allSchemaCreators from '@mpieva/psydb-schema-creators';
import agent from '@mpieva/psydb-ui-request-agents';

import { ROSchemaForm } from '@mpieva/psydb-ui-lib';

import {
    LinkButton,
    Icons
} from '@mpieva/psydb-ui-layout';

const EditLinkButton = ({
    to,
    label
}) => {
    return (
        <LinkButton
            className='d-flex align-items-center'
            to={ to }>
            <span className='d-inline-block mr-2'>{ label }</span>
            <Icons.ArrowRightShort style={{ height: '24px', width: '24px' }} />
        </LinkButton>
    );
}

const StudyRecordDetails = ({
    fetched,
    recordType,
    onSuccessfulUpdate,
}) => {
    var collection = 'study';

    var { path, url } = useRouteMatch();
    var { id } = useParams();
    var permissions = usePermissions();
    
    var canEdit = permissions.hasCollectionFlag(collection, 'write');

    var { hasSubChannels } = allSchemaCreators[collection];

    var {
        schema,
        record,
        related,
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

    // TODO: it blows up when i have more than one subject type
    delete formSchema.properties.selectionSettingsBySubjectType;
    delete formData.selectionSettingsBySubjectType;

    delete formSchema.properties.inhouseTestLocationSettings;
    delete formData.inhouseTestLocationSettings;

    delete formSchema.properties.excludedOtherStudyIds;
    delete formData.excludedOtherStudyIds;
    delete formData.internals;

    //console.log(formSchema);
    //console.log(formData);

    return (
        <div className='mt-3 position-relative'>
            <ROSchemaForm
                schema={ formSchema }
                formData={ formData }
                formContext={ formContext }
            />
            { canEdit && (
                <div style={{
                    position: 'absolute', right: '0px', top: '0px'
                }}>
                    <EditLinkButton
                        label='Bearbeiten'
                        to={ `${url}/edit` }
                    />
                </div>
            )}
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

export default StudyRecordDetails;
