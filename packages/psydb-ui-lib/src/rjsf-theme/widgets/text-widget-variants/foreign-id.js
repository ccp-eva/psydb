import React, { useCallback } from 'react';

import { Form, InputGroup, Button } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';

const ForeignId = ({
    id,
    className,
    value,
    onChange,
    hasErrors,
    ...other
}) => {
    return (
        <div className={ className }>
            <InputGroup>
                <Form.Control
                    className={ 
                        `${hasErrors ? 'is-invalid' : ''} border pl-3 bg-white`
                    }
                    value={ value }
                    placeholder='Bitte Datensatz wählen'
                    plaintext
                    readOnly
                />
                <InputGroup.Append>
                    <Button>
                        <PencilFill style={{ marginTop: '-3px' }}/>
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </div>
    )
}

export default ForeignId;
