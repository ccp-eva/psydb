import React from 'react';

import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Link = ({
    to,
    className,
    children
}) => (
    <LinkContainer to={ to }>
        <Nav.Link className={ className }>{ children }</Nav.Link>
    </LinkContainer>
)

const SideNav = ({
    permissions
}) => (
    <Nav className='flex-column navbar navbar-light bg-light' as='nav'>
        <Link className='navbar-brand' to='/'>
            <b>Psychology DB</b>
        </Link>
        <div className='navbar-nav'>
            <Link to='/custom-record-types'>
                Datensatz-Typen
            </Link>
            <Link to='/locations'>
                Locations
            </Link>
            <Link to='/subjects'>
                Probanden
            </Link>
        </div>
    </Nav>
)

export default SideNav;
