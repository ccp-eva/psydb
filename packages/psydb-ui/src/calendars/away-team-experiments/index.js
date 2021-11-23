import React, { useMemo, useEffect, useReducer } from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { LinkContainer } from '@mpieva/psydb-ui-layout';
import { ResearchGroupNav } from '@mpieva/psydb-ui-lib';

import RecordTypeNav from '@mpieva/psydb-ui-lib/src/record-type-nav';
//import Calendar from './calendar';

const AwayTeamExperimentsRouting = ({
    locationTypes
}) => {
    var { path, url } = useRouteMatch();
    var permissions = usePermissions();

    return (
        <>
            <LinkContainer to={ url }>
                <h5 className='mt-0 mb-3 text-muted' role='button'>
                    Externe Termine
                </h5>
            </LinkContainer>
                
            <Switch>
                <Route exact path={`${path}`}>
                    <RedirectOrTypeNav
                        baseUrl={ `${url}` }
                        locationTypes={ locationTypes }
                    />
                </Route>
                <Route exact path={`${path}/:locationType`}>
                    <ResearchGroupNav
                        autoRedirect={ true }
                        filterIds={
                            permissions.isRoot()
                            ? undefined
                            : permissions.getLabOperationFlagIds(
                                'away-team', 'canViewExperimentCalendar'
                            )
                        }
                    />
                </Route>
                <Route path={`${path}/:locationType/:researchGroupId`}>
                    { /* <Calendar /> */ }
                </Route>
            </Switch>
        </>
    );
}

// FIXME redundant
const RedirectOrTypeNav = ({
    baseUrl,
    locationTypes,
    title,
}) => {
    if (locationTypes.length === 1) {
        return (
            <Redirect to={
                `${baseUrl}/${locationTypes[0].type}`
            } />
        )
    }
    else {
        return (
            <>
                { title && (
                    <h2>{ title }</h2>
                )}
                <RecordTypeNav items={ locationTypes } />
            </>
        )
    }
}

export default AwayTeamExperimentsRouting;
