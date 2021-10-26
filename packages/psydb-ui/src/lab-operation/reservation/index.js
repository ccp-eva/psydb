import React from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { PageWrappers } from '@mpieva/psydb-ui-layout';

import { Landing } from './landing';
import { Main } from './main';

const ReservationRouting = ({ customRecordTypes }) => {
    var { path, url } = useRouteMatch();
    return (
        <PageWrappers.Level2 title='Reservierung'>
            <Switch>
                <Route exact path={`${path}`}>
                    <Landing />
                </Route>
                <Route path={`${path}/:studyId`}>
                    <Main customRecordTypes={ customRecordTypes } />
                </Route>
            </Switch>
        </PageWrappers.Level2>
    )
}


export default ReservationRouting;
