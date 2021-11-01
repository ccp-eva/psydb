import React from 'react';

import {
    Nav,
    LinkContainer
} from '@mpieva/psydb-ui-layout';

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
    <>
        <h2
            className='text-center pt-3 pb-3 m-0'
            style={{ background: '#006c66'}}
        >
            <Link to='/'>
                <b className='text-white'>PsyDB</b>
            </Link>
        </h2>
        <Nav
            className='flex-column navbar navbar-light bg-light border'
            as='nav'
        >
            <div className='navbar-nav'>
                <Link to='/calendars'>Kalender</Link>
                <Nav className='flex-column pl-3'>
                    <Link to='/calendars/reception'>Rezeption</Link>
                    <Link to='/calendars/inhouse'>Interne Termine</Link>
                    <Link to='/calendars/away-team'>Externe Termine</Link>
                    <Link to='/calendars/online-video-call'>Video Termine</Link>
                </Nav>
                <Link to='/lab-operation'>Studienbetrieb</Link>
                <Nav className='flex-column pl-3'>
                    <Link to='/lab-operation/reservation'>Reservierung</Link>
                    <Link to='/lab-operation/subject-selection'>
                        Probandenauswahl
                    </Link>
                    <Link to='/lab-operation/invite-confirmation'>
                        Terminbestätigung
                    </Link>
                    <Link to='/lab-operation/experiment-postprocessing'>
                        Nachbereitung
                    </Link>
                </Nav>
                <Link to='/subjects'>Probanden</Link>
                <Link to='/locations'>Locations</Link>
                <Link to='/studies'>Studien</Link>
                <Link to='/personnel'>Mitarbeiter</Link>
                <Link to='/external-persons'>Externe Personen</Link>
                <Link to='/external-organizations'>Externe Organsationen</Link>
                <Link to='/research-groups'>Forschungsgruppen</Link>
                <Link to='/system-roles'>System-Rollen</Link>
                <Link to='/custom-record-types'>Datensatz-Typen</Link>
                <Link to='/helper-sets'>Hilfstabellen</Link>
            </div>
        </Nav>
    </>
)

export default SideNav;
