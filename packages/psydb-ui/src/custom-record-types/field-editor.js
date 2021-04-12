import React, { useState, useEffect } from 'react';

import { Button } from 'react-bootstrap';

import allSchemaCreators from '@mpieva/psydb-schema-creators';
import NewFieldModal from './new-field-modal';

const FieldEditor = ({ record, onEdited }) => {
    var [ showNewFieldModal, setShowNewFieldModal ] = useState(false);

    var handleShowNewFieldModal = () => {
        setShowNewFieldModal(true);
    }

    var handleCloseNewFieldModal = () => {
        setShowNewFieldModal(false);
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
            />
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

    return (
        <div>
            { nextFields.map(field => (
                <div>
                    { field.label } { field.key } { field.type } { field.subChannelKey }
                </div>
            )) }
        </div>
    );
}

export default FieldEditor;
