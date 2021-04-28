import React, { useCallback } from 'react';

import { Form, InputGroup, Button } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';

const ForeignId = ({
    id,
    className,
    value,
    onChange,
    ...other
}) => {
    // NOTE: w/o the wrapper div the input group freaks out
    return (
        <div className={ className }>
            <InputGroup>
                <Form.Control
                    className={ `border pl-3` }
                    value={ value }
                    placeholder='Bitte Eintrag wählen'
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
