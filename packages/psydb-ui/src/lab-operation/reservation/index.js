import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { PageWrappers } from '@mpieva/psydb-ui-layout';

import Landing from './landing';
import Main from './main';

const ReservationRouting = (ps) => {
    var { customRecordTypes } = ps;

    var translate = useUITranslation();
    var { path, url } = useRouteMatch();

    return (
        <PageWrappers.Level2
            title={ translate('Reservation') }
            titleLinkUrl={ url }
        >
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
