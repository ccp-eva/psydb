import React from 'react';
import { Alert } from 'react-bootstrap';
export const PermissionDenied = (ps) => {
    return (
        <Alert variant='danger'>
            <b>Zugriff Verweigert</b>
        </Alert>
    )
}
