import React from 'react';

import {
    Nav,
    LinkContainer
} from '@mpieva/psydb-ui-layout';

import {
    WhenAllowed
} from '@mpieva/psydb-ui-lib';

const Link = ({
    to,
    className,
    children
}) => (
    <LinkContainer to={ to }>
        <Nav.Link className={ className }>{ children }</Nav.Link>
    </LinkContainer>
)

const SideNav = (ps) => {
    return (
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
                        <WhenAllowed flag='canViewReceptionCalendar'>
                            <Link to='/calendars/reception'>Rezeption</Link>
                        </WhenAllowed>

                        <WhenAllowed
                            labType='inhouse'
                            labFlag='canViewExperimentCalendar'
                        >
                            <Link to='/calendars/inhouse'>Interne Termine</Link>
                        </WhenAllowed>

                        <WhenAllowed
                            labType='away-team'
                            labFlag='canViewExperimentCalendar'
                        >
                            <Link to='/calendars/away-team'>Externe Termine</Link>
                        </WhenAllowed>

                        <WhenAllowed
                            labType='online-video-call'
                            labFlag='canViewExperimentCalendar'
                        >
                            <Link to='/calendars/online-video-call'>Video Termine</Link>
                        </WhenAllowed>
                    </Nav>

                    <WhenAllowed labFlags={[
                        'canWriteReservations',
                        'canSelectSubjectsForExperiments',
                        'canConfirmSubjectInvitation',
                        'canPostprocessExperiments',
                    ]}>
                        <Link to='/lab-operation'>Studienbetrieb</Link>
                        <Nav className='flex-column pl-3'>

                            <WhenAllowed labFlag='canWriteReservations'>
                                <Link to='/lab-operation/reservation'>Reservierung</Link>
                            </WhenAllowed>

                            <WhenAllowed labFlag='canSelectSubjectsForExperiments'>
                                <Link to='/lab-operation/subject-selection'>
                                    Probandenauswahl
                                </Link>
                            </WhenAllowed>

                            <WhenAllowed labFlag='canConfirmSubjectInvitation'>
                                <Link to='/lab-operation/invite-confirmation'>
                                    Terminbestätigung
                                </Link>
                            </WhenAllowed>

                            <WhenAllowed labFlag='canPostprocessExperiments'>
                                <Link to='/lab-operation/experiment-postprocessing'>
                                    Nachbereitung
                                </Link>
                            </WhenAllowed>
                        </Nav>
                    </WhenAllowed>

                    <WhenAllowed flags={[
                        'canReadSubjects', 'canWriteSubjects'
                    ]}>
                        <Link to='/subjects'>Probanden</Link>
                    </WhenAllowed>

                    <WhenAllowed flags={[
                        'canReadStudies', 'canWriteStudies'
                    ]}>
                        <Link to='/studies'>Studien</Link>
                    </WhenAllowed>

                    <WhenAllowed flag='canWriteAdministrativeCollections'>
                        <Link to='/locations'>Locations</Link>
                        <Link to='/external-persons'>Externe Personen</Link>
                        <Link to='/external-organizations'>Externe Organsationen</Link>
                        <Link to='/helper-sets'>Hilfstabellen</Link>
                    </WhenAllowed>

                    <WhenAllowed flag='canWritePersonnel'>
                        <Link to='/personnel'>Mitarbeiter</Link>
                    </WhenAllowed>

                    <WhenAllowed isRoot>
                        <Link to='/research-groups'>Forschungsgruppen</Link>
                        <Link to='/system-roles'>System-Rollen</Link>
                        <Link to='/custom-record-types'>Datensatz-Typen</Link>
                    </WhenAllowed>
                </div>
            </Nav>
        </>
    )
}

export default SideNav;
