import React from 'react';

import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const LinkButton = ({
    to,
    target,
    ...other
}) => (
    target
    ? (
        <a
            target={ target }
            href={ `#${to}` }
            className={ `btn btn-primary btn-${other.size}` }
        >
            { other.children }
        </a>
    )
    : (
        <LinkContainer to={ to }>
            <Button { ...other } />
        </LinkContainer>
    )
);

export default LinkButton;
