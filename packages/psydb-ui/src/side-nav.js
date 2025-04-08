import React from 'react';
import { useUIConfig, useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Nav, LinkContainer } from '@mpieva/psydb-ui-layout';

import Logo from './main-logo';

const Link = (ps) => {
    var { to, ...pass } = ps;

    return (
        <LinkContainer to={ to }>
            <Nav.Link { ...pass } />
        </LinkContainer>
    );
}

const SideNav = (ps) => {
    var config = useUIConfig();
    var permissions = usePermissions();
    var [{ translate }] = useI18N();
    var { sideNav } = config;

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
                </div>
            </Nav>
        </>
    );
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
