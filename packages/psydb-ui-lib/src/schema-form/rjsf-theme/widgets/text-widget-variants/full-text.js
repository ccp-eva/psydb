import React, { useCallback } from 'react';
import { Form } from 'react-bootstrap';

const FullText = ({
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
            onChange,

            as: 'textarea',
            rows: 8
        })} />
    )
}

export default FullText;


