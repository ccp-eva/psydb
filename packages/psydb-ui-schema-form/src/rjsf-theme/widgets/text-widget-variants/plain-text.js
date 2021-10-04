import React, { useCallback } from 'react';
import { Form } from 'react-bootstrap';

const PlainText = ({
    id,
    className,
    type,
    value,
    onChange,
    ...other
}) => {
    return (
        <Form.Control {...({
            id,
            className,
            type,
            value,
            onChange
        })} />
    )
}

export default PlainText;


