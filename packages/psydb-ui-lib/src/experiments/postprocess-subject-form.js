import React, { useState, useCallback } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import enums from '@mpieva/psydb-schema-enums';

import { createSend } from '@mpieva/psydb-ui-utils';

const PostprocessSubjectForm = ({
    experimentType,
    experimentId,
    subjectId,
    onSuccessfulUpdate
}) => {
    var [ selectedStatus, setSelectedStatus ] = useState('participated');

    var handleChangeStatus = createSend(() => ({
        type: 'experiment/change-participation-status',
        payload: {
            experimentId: experimentId,
            subjectId: subjectId,
            participationStatus: selectedStatus,
        }
    }), { onSuccessfulUpdate });

    var handleSelectionChange = useCallback((event) => {
        var { target: { value }} = event;
        setSelectedStatus(value);
    }, []);

    var options;
    if (experimentType === 'away-team') {
        options = {
            keys: [
                ...enums.awayTeamParticipationStatus.keys,
                ...enums.awayTeamUnparticipationStatus.keys,
            ],
            names: [
                ...enums.awayTeamParticipationStatus.names,
                ...enums.awayTeamUnparticipationStatus.names,
            ]
        }
    }
    else {
        options = {
            keys: [
                ...enums.inviteParticipationStatus.keys,
                ...enums.inviteUnparticipationStatus.keys,
            ],
            names: [
                ...enums.inviteParticipationStatus.names,
                ...enums.inviteUnparticipationStatus.names,
            ]
        }
    }

    return (
        <InputGroup>
            <Form.Control
                as='select'
                value={ selectedStatus }
                onChange={ handleSelectionChange }
            >   
                { /*selectedStatus === 'unknown' && (
                    <option>Bitte wählen...</option>
                )*/ }
                { options.keys.map((k, i) => (
                    <option key={k} value={k}>
                        { options.names[i] }
                    </option>
                ))}
            </Form.Control>
            <InputGroup.Append>
                <Button
                    onClick={ handleChangeStatus }
                    disabled={ selectedStatus === 'unknown' }
                >
                    Speichern
                </Button>
            </InputGroup.Append>
        </InputGroup>
    )
}

export default PostprocessSubjectForm;
