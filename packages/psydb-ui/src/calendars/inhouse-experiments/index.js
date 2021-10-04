import React, { useMemo, useEffect, useReducer } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import {
    LinkContainer
} from '@mpieva/psydb-ui-layout';

import agent from '@mpieva/psydb-ui-request-agents';
import RecordTypeNav from '@mpieva/psydb-ui-lib/src/record-type-nav';
import ResearchGroupNav from './research-group-nav';
import Calendar from './calendar';

const InhouseExperimentsRouting = ({
    subjectRecordTypes
}) => {
    var { path, url } = useRouteMatch();

    return (
        <>
            <LinkContainer to={ url }>
                <h5 className='mt-0 mb-3 text-muted' role='button'>
                    Inhouse-Termine
                </h5>
            </LinkContainer>
                
            <Switch>
                <Route exact path={`${path}`}>
                    <RedirectOrTypeNav
                        baseUrl={ `${url}` }
                        subjectTypes={ subjectRecordTypes }
                    />
                </Route>
                <Route exact path={`${path}/:subjectType`}>
                    <ResearchGroupNav />
                </Route>
                <Route path={`${path}/:subjectType/:researchGroupId`}>
                    <Calendar />
                </Route>
            </Switch>
        </>
    );
}

// FIXME redundant
const RedirectOrTypeNav = ({
    baseUrl,
    subjectTypes,
    title,
}) => {
    if (subjectTypes.length === 1) {
        return (
            <Redirect to={
                `${baseUrl}/${subjectTypes[0].type}`
            } />
        )
    }
    else {
        return (
            <>
                { title && (
                    <h2>{ title }</h2>
                )}
                <RecordTypeNav items={ subjectTypes } />
            </>
        )
    }
}

export default InhouseExperimentsRouting;
