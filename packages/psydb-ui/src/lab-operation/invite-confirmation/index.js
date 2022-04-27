import React, { useMemo, useEffect, useReducer } from 'react';
import { unique } from '@mpieva/psydb-core-utils';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

var { PageWrappers } = require('@mpieva/psydb-ui-layout');

import {
    RedirectOrTypeNav,
    ResearchGroupNav
} from '@mpieva/psydb-ui-lib';

import InviteConfirmationList from './invite-confirmation-list';

const InviteConfirmationRouting = (ps) => {
    var { subjectRecordTypes } = ps;

    var { path, url } = useRouteMatch();
    var permissions = usePermissions();

    var researchGroupIds = (
        permissions.isRoot()
        ? permissions.raw.forcedResearchGroupId
        : unique([
            ...permissions.getLabOperationFlagIds(
                'inhouse', 'canConfirmSubjectInvitation'
            ),
            ...permissions.getLabOperationFlagIds(
                'online-video-call', 'canConfirmSubjectInvitation'
            ),
        ])
    );

    return (
        <PageWrappers.Level2 title='Terminbestätigung'>
            <Switch>
                <Route exact path={`${path}`}>
                    <RedirectOrTypeNav
                        baseUrl={ `${url}` }
                        subjectTypes={ subjectRecordTypes }
                    />
                </Route>
                <Route exact path={`${path}/:subjectType`}>
                    <ResearchGroupNav
                        autoRedirect={ true }
                        filterIds={ researchGroupIds }
                    />
                </Route>
                <Route path={`${path}/:subjectType/:researchGroupId`}>
                    <InviteConfirmationList />
                </Route>
            </Switch>
        </PageWrappers.Level2>
    );
}

export default InviteConfirmationRouting;
