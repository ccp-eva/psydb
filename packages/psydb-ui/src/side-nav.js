import React from 'react';

import { Nav, NavBar } from 'react-bootstrap';
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
            <Link to='/calendars'>Kalender</Link>
            <Nav className='flex-column pl-3'>
                <Link to='/calendars'>Rezeption</Link>
                <Link to='/calendars'>Inhouse Termine</Link>
                <Link to='/calendars'>Externe Termine</Link>
            </Nav>
            <Link to='/lab-operation'>Laborbetrieb</Link>
            <Nav className='flex-column pl-3'>
                <Link to='/lab-operation/reservation'>Reservierung</Link>
                <Link to='/lab-operation/subject-selection'>
                    Probandenauswahl
                </Link>
                <Link to='/lab-operation/experiment-confirmation'>
                    Terminbestätigung
                </Link>
                <Link to='/lab-operation/experiment-postprocessing'>
                    Nachbereitung
                </Link>
            </Nav>
            <Link to='/subjects'>Probanden</Link>
            <Link to='/locations'>Locations</Link>
            <Link to='/personnel'>Mitarbeiter</Link>
            <Link to='/research-groups'>Forschungsgruppen</Link>
            <Link to='/system-roles'>System-Rollen</Link>
            <Link to='/custom-record-types'>Datensatz-Typen</Link>
            <Link to='/helper-sets'>Hilfstabellen</Link>
        </div>
    </Nav>
)

export default SideNav;
