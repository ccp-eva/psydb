import React from 'react';

import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const LinkButton = ({
    to,
    ...other
}) => (
    <LinkContainer to={to}>
        <Button { ...other } />
    </LinkContainer>
);

export default LinkButton;
