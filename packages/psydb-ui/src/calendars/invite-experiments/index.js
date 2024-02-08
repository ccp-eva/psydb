import React from 'react';
import {
    Route,
    Switch,
    useRouteMatch,
} from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { LinkContainer, ErrorFallbacks } from '@mpieva/psydb-ui-layout';
import { RedirectOrTypeNav, ResearchGroupNav } from '@mpieva/psydb-ui-lib';

import Calendar from './calendar';

const getTitleByType = (inviteType) => {
    var title = {
        'inhouse': 'Inhouse Appointments',
        'online-video-call': 'Video Appointments'
    }[inviteType];

    title = title || inviteType;

    return title;
}

const InviteExperimentsRouting = (ps) => {
    var {
        subjectRecordTypes,
        inviteType
    } = ps;
    var { path, url } = useRouteMatch();
    
    var translate = useUITranslation();
    var permissions = usePermissions();

    if (!subjectRecordTypes?.length) {
        return <ErrorFallbacks.NoSubjectTypesDefined className='mt-3' />
    }

    return (
        <>
            <LinkContainer to={ url }>
                <h5 className='mt-0 mb-3 text-muted' role='button'>
                    { translate(getTitleByType(inviteType)) }
                </h5>
            </LinkContainer>
                
            <Switch>
                <Route exact path={`${path}`}>
                    <RedirectOrTypeNav
                        baseUrl={ `${url}` }
                        recordTypes={ subjectRecordTypes }
                    />
                </Route>
                <Route exact path={`${path}/:subjectType`}>
                    <ResearchGroupNav
                        autoRedirect={ true }
                        filterIds={
                            permissions.isRoot()
                            ? permissions.raw.forcedResearchGroupId
                            : permissions.getLabOperationFlagIds(
                                inviteType, 'canViewExperimentCalendar'
                            )
                        }
                    />
                </Route>
                <Route path={`${path}/:subjectType/:researchGroupId`}>
                    <Calendar inviteType={ inviteType } />
                </Route>
            </Switch>
        </>
    );
}

export default InviteExperimentsRouting;
