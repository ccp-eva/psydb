import React, { useState, useCallback } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import enums from '@mpieva/psydb-schema-enums';

import useSend from '@mpieva/psydb-ui-lib/src/use-send';

const options = {
    keys: [
        ...enums.safeParticipationStatus.keys,
        ...enums.safeUnparticipationStatus.keys,
    ],
    names: [
        ...enums.safeParticipationStatus.names,
        ...enums.safeUnparticipationStatus.names,
    ]
}

const PostprocessSubjectForm = ({
    experimentId,
    subjectId,
    onSuccessfulUpdate
}) => {
    var [ selectedStatus, setSelectedStatus ] = useState('unknown');

    var handleChangeStatus = useSend(() => ({
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

    return (
        <InputGroup>
            <Form.Control
                as='select'
                value={ selectedStatus }
                onChange={ handleSelectionChange }
            >   
                { selectedStatus === 'unknown' && (
                    <option>Bitte wählen...</option>
                )}
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
