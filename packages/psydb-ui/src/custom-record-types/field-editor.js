import React, { useState, useEffect } from 'react';

import { Button, Table } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';

import allSchemaCreators from '@mpieva/psydb-schema-creators';
import NewFieldModal from './new-field-modal';

const FieldEditor = ({ record, onSuccessfulUpdate }) => {
    var [ showNewFieldModal, setShowNewFieldModal ] = useState(false);

    var handleShowNewFieldModal = () => {
        setShowNewFieldModal(true);
    }

    var handleCloseNewFieldModal = () => {
        setShowNewFieldModal(false);
    }

    var handleCommitSettings = () => {
        var messageBody = {
            type: 'custom-record-types/commit-settings',
            payload: {
                id: record._id,
                lastKnownEventId: record._lastKnownEventId,
            }
        }
        return (
            agent.post('/api/', messageBody)
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
            <FieldList record={ record } />
            <Button onClick={ handleShowNewFieldModal }>
                Add new Field
            </Button>
            <NewFieldModal
                record={ record }
                show={ showNewFieldModal }
                onHide={ handleCloseNewFieldModal }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
            <hr />
            <Button onClick={ handleCommitSettings }>
                Felder fixieren
            </Button>
        </div>
    )
}

const FieldList = ({ record }) => {

    var {
        hasSubChannels,
        subChannelKeys,
    } = allSchemaCreators[record.collection];

    var nextSettings = record.state.nextSettings;
    var nextFields = [];
    if (hasSubChannels) {
        for (var key of subChannelKeys) {
            nextFields.append([
                ...nextSettings.subChannelFields[key].map(it => ({
                    ...it,
                    subChannelKey: key
                }))
            ])
        }
    }
    else {
        nextFields = nextSettings.fields;
    }

    console.log(nextFields);

    return (
        <Table bordered striped size='sm'>
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
                    <tr key={ field.key }>
                        <td>{ field.displayName }</td>
                        <td>{ field.key }</td>
                        <td>{ field.type }</td>
                        { hasSubChannels && (
                            <td>{ field.subChannelKey }</td>
                        )}
                    </tr>
                )) }
            </tbody>
        </Table>
    );
}

export default FieldEditor;
