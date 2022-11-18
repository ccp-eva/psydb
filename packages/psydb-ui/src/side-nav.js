import React from 'react';

import {
    Nav,
    LinkContainer
} from '@mpieva/psydb-ui-layout';

import {
    WhenAllowed
} from '@mpieva/psydb-ui-lib';

import Logo from './main-logo';

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
            <Logo />
            <Nav
                className='flex-column navbar navbar-light bg-light border'
                as='nav'
            >
                <div className='navbar-nav'>
                    
                    <WhenAllowed flags={[
                        'canReadSubjects', 'canWriteSubjects'
                    ]}>
                        <Link to='/subjects'><b>Proband:innen</b></Link>
                    </WhenAllowed>
                    
                    {/*<WhenAllowed flags={[
                        'canReadSubjects', 'canWriteSubjects'
                    ]}>
                        <Link to='/subject-groups'><b>Proband:innen-Gruppen</b></Link>
                    </WhenAllowed>*/}

                    <WhenAllowed flags={[
                        'canReadStudies', 'canWriteStudies'
                    ]}>
                        <Link to='/studies'><b>Studien</b></Link>
                    </WhenAllowed>


                    <Link to='/calendars'><b>Kalender</b></Link>
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
                        <Link to='/lab-operation'><b>Studienbetrieb</b></Link>
                        <Nav className='flex-column pl-3'>

                            <WhenAllowed labFlag='canWriteReservations'>
                                <Link to='/lab-operation/reservation'>Reservierung</Link>
                            </WhenAllowed>

                            <WhenAllowed labFlag='canSelectSubjectsForExperiments'>
                                <Link to='/lab-operation/subject-selection'>
                                    Proband:innenauswahl
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

                    <div className='border-top mt-2 mb-2' />

                    <WhenAllowed flags={[
                        'canReadLocations', 'canWriteLocations'
                    ]}>
                        <Link to='/locations'>Locations</Link>
                    </WhenAllowed>
                    <WhenAllowed flags={[
                        'canReadExternalPersons', 'canWriteExternalPersons'
                    ]}>
                        <Link to='/external-persons'>Externe Personen</Link>
                    </WhenAllowed>
                    <WhenAllowed flags={[
                        'canReadExternalOrganizations', 'canWriteExternalOrganizations'
                    ]}>
                        <Link to='/external-organizations'>Externe Organsationen</Link>
                    </WhenAllowed>
                    <WhenAllowed flags={[
                        'canReadStudyTopics', 'canWriteStudyTopics'
                    ]}>
                        <Link to='/study-topics'>Themengebiete</Link>
                    </WhenAllowed>
                    <WhenAllowed flags={[
                        'canReadHelperSets', 'canWriteHelperSets'
                    ]}>
                        <Link to='/helper-sets'>Hilfstabellen</Link>
                    </WhenAllowed>
                    <WhenAllowed flags={[
                        'canReadPersonnel', 'canWritePersonnel'
                    ]}>
                        <Link to='/personnel'>Mitarbeiter:innen</Link>
                    </WhenAllowed>

                    <div className='border-top mt-2 mb-2' />

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
