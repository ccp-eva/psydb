import React from 'react';
import { createTranslate } from '@mpieva/psydb-common-translations';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Nav, LinkContainer } from '@mpieva/psydb-ui-layout';
import { WhenAllowed } from '@mpieva/psydb-ui-lib';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

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
    var translate = useUITranslation();
    
    var permissions = usePermissions();
    var canViewAnyCalendar = (
        permissions.hasSomeLabOperationFlags({
            types: 'any',
            flags: [ 'canViewExperimentCalendar' ]
        })
        || permissions.hasFlag('canViewReceptionCalendar')
    );
    
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
                        <Link to='/subjects'><b>
                            { translate('Subjects') }
                        </b></Link>
                    </WhenAllowed>
                    
                    {/*<WhenAllowed flags={[
                        'canReadSubjects', 'canWriteSubjects'
                    ]}>
                        <Link to='/subject-groups'><b>Proband:innen-Gruppen</b></Link>
                    </WhenAllowed>*/}

                    <WhenAllowed flags={[
                        'canReadStudies', 'canWriteStudies'
                    ]}>
                        <Link to='/studies'><b>
                            { translate('Studies') }
                        </b></Link>
                    </WhenAllowed>

                    { canViewAnyCalendar && (
                        <>
                            <Link to='/calendars'><b>
                                { translate('Calendars') }
                            </b></Link>
                            <Nav className='flex-column pl-3'>
                                <WhenAllowed flag='canViewReceptionCalendar'>
                                    <Link to='/calendars/reception'>
                                        { translate('Reception') }
                                    </Link>
                                </WhenAllowed>

                                <WhenAllowed
                                    labType='inhouse'
                                    labFlag='canViewExperimentCalendar'
                                >
                                    <Link to='/calendars/inhouse'>
                                        { translate('Inhouse Appointments') }
                                    </Link>
                                </WhenAllowed>

                                <WhenAllowed
                                    labType='away-team'
                                    labFlag='canViewExperimentCalendar'
                                >
                                    <Link to='/calendars/away-team'>
                                        { translate('External Appointments') }
                                    </Link>
                                </WhenAllowed>

                                <WhenAllowed
                                    labType='online-video-call'
                                    labFlag='canViewExperimentCalendar'
                                >
                                    <Link to='/calendars/online-video-call'>
                                        { translate('Video Appointments') }
                                    </Link>
                                </WhenAllowed>
                            </Nav>
                        </>
                    )}

                    <WhenAllowed labFlags={[
                        'canWriteReservations',
                        'canSelectSubjectsForExperiments',
                        'canConfirmSubjectInvitation',
                        'canPostprocessExperiments',
                    ]}>
                        <Link to='/lab-operation'><b>
                            { translate('Lab Operation') }
                        </b></Link>
                        <Nav className='flex-column pl-3'>

                            <WhenAllowed labFlag='canWriteReservations'>
                                <Link to='/lab-operation/reservation'>
                                    { translate('Reservation') }
                                </Link>
                            </WhenAllowed>

                            <WhenAllowed labFlag='canSelectSubjectsForExperiments'>
                                <Link to='/lab-operation/subject-selection'>
                                    { translate('Subject Selection') }
                                </Link>
                            </WhenAllowed>

                            <WhenAllowed labFlag='canConfirmSubjectInvitation'>
                                <Link to='/lab-operation/invite-confirmation'>
                                    { translate('Confirm Appointments') }
                                </Link>
                            </WhenAllowed>

                            <WhenAllowed labFlag='canPostprocessExperiments'>
                                <Link to='/lab-operation/experiment-postprocessing'>
                                    { translate('Postprocessing') }
                                </Link>
                            </WhenAllowed>
                        </Nav>
                    </WhenAllowed>

                    <div className='border-top mt-2 mb-2' />

                    <WhenAllowed flags={[
                        'canReadLocations', 'canWriteLocations'
                    ]}>
                        <Link to='/locations'>
                            { translate('Locations') }
                        </Link>
                    </WhenAllowed>
                    <WhenAllowed flags={[
                        'canReadExternalPersons', 'canWriteExternalPersons'
                    ]}>
                        <Link to='/external-persons'>
                            { translate('External Persons') }
                        </Link>
                    </WhenAllowed>
                    <WhenAllowed flags={[
                        'canReadExternalOrganizations', 'canWriteExternalOrganizations'
                    ]}>
                        <Link to='/external-organizations'>
                            { translate('External Organizations') }
                        </Link>
                    </WhenAllowed>
                    <WhenAllowed flags={[
                        'canReadSubjectGroups', 'canWriteSubjectGroups'
                    ]}>
                        <Link to='/subject-groups'>
                            { translate('Subject Groups') }
                        </Link>
                    </WhenAllowed>
                    <WhenAllowed flags={[
                        'canReadStudyTopics', 'canWriteStudyTopics'
                    ]}>
                        <Link to='/study-topics'>
                            { translate('Study Topics') }
                        </Link>
                    </WhenAllowed>
                    <WhenAllowed flags={[
                        'canReadHelperSets', 'canWriteHelperSets'
                    ]}>
                        <Link to='/helper-sets'>
                            { translate('Helper Tables') }
                        </Link>
                    </WhenAllowed>
                    <WhenAllowed flags={[
                        'canReadPersonnel', 'canWritePersonnel'
                    ]}>
                        <Link to='/personnel'>
                            { translate('Staff Members') }
                        </Link>
                    </WhenAllowed>

                    <div className='border-top mt-2 mb-2' />

                    <WhenAllowed isRoot>
                        <Link to='/research-groups'>
                            { translate('Research Groups') }
                        </Link>
                        <Link to='/system-roles'>
                            { translate('System Roles') }
                        </Link>
                        <Link to='/custom-record-types'>
                            { translate('Record Types') }
                        </Link>
                        <Link to='/api-keys'>
                            { translate('API Keys') }
                        </Link>
                        <Link to='/audit'>
                            { translate('Audit') }
                        </Link>
                        
                        {/*<div className='border-top mt-2 mb-2' />

                        <Link to='/fixes-checker'>
                            Fixes Checker
                        </Link>*/}
                    </WhenAllowed>
                </div>
            </Nav>
        </>
    )
}

export default SideNav;
