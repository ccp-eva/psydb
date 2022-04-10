import React, { useState, useEffect, useReducer, forwardRef } from 'react';

import { useRouteMatch, useParams } from 'react-router-dom';

import allSchemaCreators from '@mpieva/psydb-schema-creators';
import agent from '@mpieva/psydb-ui-request-agents';

import { SchemaForm } from '@mpieva/psydb-ui-lib';

import { only } from '@mpieva/psydb-core-utils';
import { usePermissions, useSendPatch } from '@mpieva/psydb-ui-hooks';
import { Pair } from '@mpieva/psydb-ui-layout';
import { withRecordEditor, FormBox } from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';

const EditForm = (ps) => {
    var {
        collection,
        recordType,
        id,
        fetched,
        onSuccessfulUpdate
    } = ps;

    var { record, crtSettings, related } = fetched;
    var { fieldDefinitions } = crtSettings;
    
    var permissions = usePermissions();

    var send = useSendPatch({
        collection,
        recordType,
        record,
        onSuccessfulUpdate
    });
    
    var defaults = MainForm.createDefaults({
        fieldDefinitions,
        permissions
    });
    
    var initialValues = only({
        from: record.state,
        paths: [
            'name',
            'shorthand',
            'runningPeriod',
            'enableFollowUpExperiments',
            'researchGroupIds',
            'scientistIds',
            'studyTopicIds',

            'custom',
            'systemPermissions',
        ]
    });

    // FIXME: use deep merge
    initialValues = {
        ...defaults,
        ...initialValues,
        custom: {
            ...defaults.custom,
            ...initialValues.custom
        }
    }

    var {
        sequenceNumber,
        onlineId
    } = record;

    var renderedContent = (
        <>
            { sequenceNumber && (
                <Pair 
                    label='ID Nr.'
                    wLeft={ 3 } wRight={ 9 } className='px-3'
                >
                    { sequenceNumber }
                </Pair>
            )}
            { sequenceNumber && (
                <hr />
            )}
            <MainForm.Component
                title='Studie bearbeiten'
                crtSettings={ crtSettings }
                initialValues={ initialValues }
                onSubmit={ send.exec }
                related={ related }
                permissions={ permissions }
                renderFormBox={ false }
            />
        </>
    );

    return (
        <div className='mt-3'>
            { renderedContent }
        </div>
    );
}

const RecordEditor = withRecordEditor({
    EditForm,
    shouldFetchSchema: false,
});


const StudyRecordForm_OLD = ({
    type,
    recordType,
    onSuccessfulUpdate,
}) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();

    var collection = 'study';

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
        
        if (type !== 'create') {
            agent.readRecord({
                collection,
                recordType,
                id
            }).then((response) => {
                dispatch({ type: 'init-data', payload: {
                    ...response.data.data
                }})
            })
        }
    }, [ id, collection, recordType ])

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
        var messageType = `${collection}/${recordType}/${messageAction}`

        var payload = ({
            ...(type === 'edit' ? {
                id,
                lastKnownEventId: record._lastKnownEventId,
            } : {}),
            props: formData,
        })
        
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
    delete formData.selectionSettingsBySubjectType;
    delete formSchema.properties.selectionSettingsBySubjectType;

    delete formData.inhouseTestLocationSettings;
    delete formSchema.properties.inhouseTestLocationSettings;

    delete formSchema.properties.excludedOtherStudyIds;
    delete formData.excludedOtherStudyIds;

    delete formData.isCreateFinalized;
    delete formData.internals;

    //console.log(formSchema);
    //console.log(formData);

    return (
        <div className='mt-3 position-relative'>
            <SchemaForm
                schema={ formSchema }
                formData={ formData }
                formContext={ formContext }
                onSubmit={ onSubmit }
            />
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

export default RecordEditor;
//export default StudyRecordForm_OLD;
