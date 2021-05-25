import React, { useState, useEffect, useReducer, useMemo } from 'react';
import { Button, Table } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import allSchemaCreators from '@mpieva/psydb-schema-creators';

import EditIconButton from '@mpieva/psydb-ui-lib/src/edit-icon-button';
import NewFieldModal from './new-field-modal';
import EditFieldModal from './edit-field-modal';


const FieldEditor = ({ record, onSuccessfulUpdate }) => {

    var [ state, dispatch ] = useReducer(reducer, {});
    var {
        showNewFieldModal,
        showEditFieldModal,
        editFieldModalData
    } = state;

    var [
        handleShowNewFieldModal,
        handleHideNewFieldModal,

        handleShowEditFieldModal,
        handleHideEditFieldModal,
    ] = useMemo(() => ([
        () => dispatch({ type: 'show-new-field-modal' }),
        () => dispatch({ type: 'hide-new-field-modal' }),

        (field) => dispatch({ type: 'show-edit-field-modal', payload: {
            field
        }}),
        () => dispatch({ type: 'hide-edit-field-modal' }),
    ]));

    var handleCommitSettings = () => {
        var message = {
            type: 'custom-record-types/commit-settings',
            payload: {
                id: record._id,
                lastKnownEventId: record._lastKnownEventId,
            }
        }
        return (
            agent.send({ message })
            .then(
                (response) => {
                    onSuccessfulUpdate()
                },
                (error) => {
                    console.log('ERR:', error)
                    alert('TODO')
                }
            )
        ) 
    }

    return (
        <div>
            <Button onClick={ handleShowNewFieldModal }>
                Neues Feld
            </Button>

            <NewFieldModal
                record={ record }
                show={ showNewFieldModal }
                onHide={ handleHideNewFieldModal }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
            
            <EditFieldModal
                record={ record }
                show={ showEditFieldModal }
                onHide={ handleHideEditFieldModal }
                { ...editFieldModalData }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
            
            <FieldList
                record={ record }
                onEditField={
                    handleShowEditFieldModal
                }
            />

            <hr />

            <Button
                variant='danger'
                onClick={ handleCommitSettings }
                disabled={
                    !(record.state.isDirty || record.state.isNew)
                }
            >
                Felder fixieren
            </Button>

        </div>
    )
}

const FieldList = ({
    record,
    onEditField
}) => {

    var {
        hasSubChannels,
        subChannelKeys,
    } = allSchemaCreators[record.collection];

    var nextSettings = record.state.nextSettings;
    var nextFields = [];
    if (hasSubChannels) {
        for (var key of subChannelKeys) {
            nextFields = [
                ...nextFields,
                ...nextSettings.subChannelFields[key].map(it => ({
                    ...it,
                    subChannelKey: key
                }))
            ]
        }
    }
    else {
        nextFields = nextSettings.fields;
    }

    return (
        <Table size='md'>
            <thead>
                <tr>
                    <th>DisplayName</th>
                    <th>Internal Key</th>
                    <th>Type</th>
                    { hasSubChannels && (
                        <th>SubChannel</th>
                    )}
                </tr>
            </thead>
            <tbody>
                { nextFields.map(field => (
                    <Row { ...({
                        key: field.key,
                        field,
                        hasSubChannels,
                        onEditField
                    }) }/>
                )) }
            </tbody>
        </Table>
    );
}

const Row = ({
    field,
    hasSubChannels,
    onEditField
}) => {
    var className = [];
    if (field.isDirty) {
        className.push('text-danger');
    }
    className = className.join(' ');

    return (
        <tr className={ className }>
            <td>
                { field.displayName }
                { field.isDirty && (
                    field.isNew
                    ? ' (neu)'
                    : ' (bearbeitet)'
                )}
            </td>
            <td>{ field.key }</td>
            <td>{ field.type }</td>
            { hasSubChannels && (
                <td>{ field.subChannelKey }</td>
            )}
            <td className='d-flex justify-content-end'>
                <EditIconButton
                    onClick={ () => onEditField(field) }
                />
            </td>
        </tr>
    )
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {

        case 'show-new-field-modal':
            return {
                ...state,
                showNewFieldModal: true,
            }
        case 'hide-new-field-modal':
            return {
                ...state,
                showNewFieldModal: false,
            }

        case 'show-edit-field-modal':
            return {
                ...state,
                showEditFieldModal: true,
                editFieldModalData: payload
            }
        case 'hide-edit-field-modal':
            return {
                ...state,
                showEditFieldModal: false,
            }

    }
}
 

export default FieldEditor;
