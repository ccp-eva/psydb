import React, { useContext } from 'react';
import { SelfContext } from '@mpieva/psydb-ui-contexts';

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

const usePermissions = () => {
    var { permissions } = useContext(SelfContext);
    
    var {
        hasRootAccess,
        forcedResearchGroup,
        researchGroupIdsByFlag
    } = permissions;

    var isRoot = () => (
        hasRootAccess && !forcedResearchGroup
    )

    var hasFlag = (flag) => (
        isRoot()
        ? true
        : (
            researchGroupIdsByFlag[flag] &&
            researchGroupIdsByFlag[flag].length > 0
        )
    );

    var hasSomeFlags = (flags) => (
        flags.some(it => hasFlag(it))
    );

    var hasLabOperationFlag = (type, flag) => {
        if (isRoot()) {
            return true;
        }
        else {
            var { labOperation } = researchGroupIdsByFlag;
            if (!labOperation) {
                return false;
            }
            
            var allFlags = labOperation[type];
            if (!allFlags) {
                return false;
            }
            var ids = allFlags[flag];
            if (!ids) {
                return false
            }

            return ids.length > 0
        }
    }

    var hasSomeLabOperationFlags = ({ types, flags }) => {
        if (types === 'any') {
            types = anyLabOperationTypes;
        }
        return types.some(t => (
            flags.some(f => hasLabOperationFlag(t, f))
        ))
    }

    return {
        isRoot,
        hasFlag,
        hasSomeFlags,
        hasLabOperationFlag,
        hasSomeLabOperationFlags,
    }
}

var anyLabOperationTypes = [
    'inhouse', 
    'away-team',
    'online-video-call',
    'online-survey'
];

const SideNav = ({
    permissions
}) => {
    var {
        isRoot,
        hasRootAccess,
        hasFlag,
        hasSomeFlags,
        hasSomeLabOperationFlags
    } = usePermissions();

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
                        { hasFlag('canViewReceptionCalendar') && (
                            <Link to='/calendars/reception'>Rezeption</Link>
                        )}

                        { hasSomeLabOperationFlags({
                            types: [ 'inhouse' ],
                            flags: [ 'canViewExperimentCalendar' ]
                        }) && (
                            <Link to='/calendars/inhouse'>Interne Termine</Link>
                        )}

                        { hasSomeLabOperationFlags({
                            types: [ 'away-team' ],
                            flags: [ 'canViewExperimentCalendar' ]
                        }) && (
                            <Link to='/calendars/away-team'>Externe Termine</Link>
                        )}

                        { hasSomeLabOperationFlags({
                            types: [ 'online-video-call' ],
                            flags: [ 'canViewExperimentCalendar' ]
                        }) && (
                            <Link to='/calendars/online-video-call'>Video Termine</Link>
                        )}
                    </Nav>

                    { hasSomeLabOperationFlags({
                        types: 'any',
                        flags: [
                            'canWriteReservations',
                            'canSelectSubjectsForExperiments',
                            'canConfirmSubjectInvitation',
                            'canPostprocessExperiments',
                        ]
                    }) && (
                        <>
                            <Link to='/lab-operation'>Studienbetrieb</Link>
                            <Nav className='flex-column pl-3'>
                                
                                { hasSomeLabOperationFlags({
                                    types: 'any',
                                    flags: [ 'canWriteReservations' ],
                                }) && (
                                    <Link to='/lab-operation/reservation'>Reservierung</Link>
                                )}

                                { hasSomeLabOperationFlags({
                                    types: 'any',
                                    flags: ['canSelectSubjectsForExperiments' ],
                                }) && (
                                    <Link to='/lab-operation/subject-selection'>
                                        Probandenauswahl
                                    </Link>
                                )}

                                { hasSomeLabOperationFlags({
                                    types: 'any',
                                    flags: [ 'canConfirmSubjectInvitation' ],
                                }) && (
                                    <Link to='/lab-operation/invite-confirmation'>
                                        Terminbestätigung
                                    </Link>
                                )}

                                { hasSomeLabOperationFlags({
                                    types: 'any',
                                    flags: [ 'canPostprocessExperiments' ],
                                }) && (
                                    <Link to='/lab-operation/experiment-postprocessing'>
                                        Nachbereitung
                                    </Link>
                                )}
                            </Nav>
                        </>
                    )}

                    { hasSomeFlags([
                        'canReadSubjects', 'canWriteSubjects'
                    ]) && (
                        <Link to='/subjects'>Probanden</Link>
                    )}
                    
                    { hasSomeFlags([
                        'canReadStudies', 'canWriteStudies'
                    ]) && (
                        <Link to='/studies'>Studien</Link>
                    )}

                    { hasFlag('canWriteAdministrativeCollections') && (
                        <>
                            <Link to='/locations'>Locations</Link>
                            <Link to='/external-persons'>Externe Personen</Link>
                            <Link to='/external-organizations'>Externe Organsationen</Link>
                            <Link to='/helper-sets'>Hilfstabellen</Link>
                        </>
                    )}

                    { hasFlag('canWritePersonnel') && (
                        <Link to='/personnel'>Mitarbeiter</Link>
                    )}
                    { isRoot() && (
                        <>
                            <Link to='/research-groups'>Forschungsgruppen</Link>
                            <Link to='/system-roles'>System-Rollen</Link>
                            <Link to='/custom-record-types'>Datensatz-Typen</Link>
                        </>
                    )}
                </div>
            </Nav>
        </>
    )
}

export default SideNav;
