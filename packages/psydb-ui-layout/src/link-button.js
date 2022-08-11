import React from 'react';

import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const LinkButton = ({
    to,
    target,
    title,
    ...other
}) => (
    target
    ? (
        <a
            target={ target }
            href={ `#${to}` }
            className={ `btn btn-primary btn-${other.size}` }
            alt={ title }
        >
            { other.children }
        </a>
    )
    : (
        <LinkContainer to={ to }>
            <Button title={ title } { ...other } />
        </LinkContainer>
    )
);

export default LinkButton;
