import React from 'react';
import { useUIConfig, useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Nav, LinkContainer } from '@mpieva/psydb-ui-layout';
import { WhenAllowed } from '@mpieva/psydb-ui-lib';

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
    var config = useUIConfig();
    var permissions = usePermissions();
    var [{ translate }] = useI18N();
    var {
        sideNav,
        dev_enableWKPRCPatches = false,
        dev_enableCSVSubjectImport = false,
        dev_enableCSVParticipationImport = false,
        dev_enableStatistics = false,
    } = config;

    var canViewAnyCalendar = (
        permissions.hasSomeLabOperationFlags({
            types: 'any',
            flags: [ 'canViewExperimentCalendar' ]
        })
        || permissions.hasFlag('canViewReceptionCalendar')
    );

    var items = generateNavItems({
        items: sideNav, config, permissions, translate
    });

    return (
        <>
            <Logo />
            <Nav
                className='flex-column navbar navbar-light bg-light border'
                as='nav'
            >
                <div className='navbar-nav'>

                    { items }

                    <hr />
                    <hr />
                    
                    { dev_enableStatistics && (
                        <WhenAllowed isRoot>
                            <Link to='/statistics'><b>
                                { translate('Statistics') }
                            </b></Link>
                        </WhenAllowed>
                    )}

                    {(
                        dev_enableCSVSubjectImport
                        || dev_enableCSVParticipationImport
                    ) && (
                        <WhenAllowed isRoot>
                            <Link to='/csv-imports'><b>
                                { translate('CSV Imports') }
                            </b></Link>
                        </WhenAllowed>
                    )}

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

                    { (!dev_enableWKPRCPatches && canViewAnyCalendar) && (
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

                    { !dev_enableWKPRCPatches && <WhenAllowed labFlags={[
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
                    </WhenAllowed> }

                    <div className='border-top mt-2 mb-2' />

                    <WhenAllowed flags={[
                        'canReadLocations', 'canWriteLocations'
                    ]}>
                        <Link to='/locations'>
                            { translate('Locations') }
                        </Link>
                    </WhenAllowed>
                    { !dev_enableWKPRCPatches && <WhenAllowed flags={[
                        'canReadExternalPersons', 'canWriteExternalPersons'
                    ]}>
                        <Link to='/external-persons'>
                            { translate('External Persons') }
                        </Link>
                    </WhenAllowed>}
                    { !dev_enableWKPRCPatches && <WhenAllowed flags={[
                        'canReadExternalOrganizations', 'canWriteExternalOrganizations'
                    ]}>
                        <Link to='/external-organizations'>
                            { translate('External Organizations') }
                        </Link>
                    </WhenAllowed>}
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

var generateNavItems = (ps) => {
    var { items, prefix = '', permissions, config, translate } = ps;
    var pass = { permissions, config, translate };

    var out = [];
    for (var it of items) {
        if (typeof it === 'string') {
            out.push(
                <div className='border-top mt-2 mb-2' />
            )
            continue;
        }

        console.log(it);
        var { path, subnav } = it;
        if (prefix) {
            path = prefix + path
        }

        var label = getNavItemLabel({ path });

        if (subnav) {
            var subitems = generateNavItems({
                items: subnav, prefix: path, ...pass
            });
            if (subitems.length > 0) {
                out.push(
                    <Link to={ path }><b>{ translate(label) }</b></Link>
                )
                out.push(
                    <Nav className='flex-column pl-3'>{ subitems }</Nav>
                );
            }
        }
        else {
            var show = (
                checkNavItemEnabled({ path, config })
                && checkNavItemAllowed({ path, permissions })
            );
            if (show) {
                out.push(
                    <Link to={ path }>{ translate(label) }</Link>
                )
            }
        }
    }
    return out;
}

var getNavItemLabel = (bag) => {
    var { path } = bag;
    return '_sidenav' + path.replace(/\//g, '_');
}

var checkNavItemEnabled = (bag) => {
    var { path, config } = bag;
    var {
        dev_enableCSVSubjectImport = false,
        dev_enableCSVParticipationImport = false,
        dev_enableStatistics = false,
    } = config;

    switch (path) {
        case '/statistics':
            return dev_enableStatistics;
        case '/csv-imports':
            return (
                dev_enableCSVSubjectImport
                || dev_enableCSVParticipationImport
            );
        default:
            return true;
    }
}

var checkNavItemAllowed = (bag) => {
    var { path, permissions } = bag;
    var { hasSomeLabOperationLags, hasSomeFlags, isRoot } = permissions;

    if (isRoot()) {
        return true;
    }
    
    switch (path) {
        case '/calendars/inhouse-appointments':
            return hasSomeLabOperationFlags({
                types: [ 'inhouse' ],
                flags: [ 'canViewExperimentCalendar' ]
            });
        case '/calendars/away-team-appointments':
            return hasSomeLabOperationFlags({
                types: [ 'away-team' ],
                flags: [ 'canViewExperimentCalendar' ]
            });
        case '/calendars/video-appointments':
            return hasSomeLabOperationFlags({
                types: [ 'online-video-call' ],
                flags: [ 'canViewExperimentCalendar' ]
            });

        case '/lab-operation/reservation':
            return hasSomeLabOperationFlags({ types: 'any', flags: [
                'canWriteResevations'
            ]});
        case '/lab-operation/subject-selection':
            return hasSomeLabOperationFlags({ types: 'any', flags: [
                'canSelectSubjectsForExperiments'
            ]});
        case '/lab-operation/invite-confirmation':
            return hasSomeLabOperationFlags({ types: 'any', flags: [
                'canConfirmSubjectInvitation'
            ]});
        case '/lab-operation/experiment-postprocessing':
            return hasSomeLabOperationFlags({ types: 'any', flags: [
                'canPostprocessExperiments',
            ]});

        case '/subjects':
            return hasSomeFlags([
                'canReadSubjects',
                'canWriteSubjects'
            ]);
        case '/studies':
            return hasSomeFlags([
                'canReadStudies',
                'canWriteStudies'
            ]);
        case '/external-persons':
            return hasSomeFlags([
                'canReadExternalPersons',
                'canWriteExternalPersons'
            ]);
        case '/external-organizations':
            return hasSomeFlags([
                'canReadExternalOrganizations',
                'canWriteExternalOrganizations'
            ]);
        case '/subject-groups':
            return hasSomeFlags([
                'canReadSubjectGroups',
                'canWriteSubjectGroups'
            ]);
        case '/study-topics':
            return hasSomeFlags([
                'canReadStudyTopics',
                'canWriteStudyTopics'
            ]);
        case '/helper-sets':
            return hasSomeFlags([
                'canReadHelperSets',
                'canWriteHelperSets'
            ]);
        case '/personnel':
            return hasSomeFlags([
                'canReadPersonnel',
                'canWritePersonnel'
            ]);
        case '/statistics':
        case '/csv-imports':
        case '/research-groups':
        case '/system-roles':
        case '/custom-record-types':
        case '/api-keys':
        case '/audit':
            return false;
    }

    return false;
}

export default SideNav;
