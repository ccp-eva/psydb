import React from 'react';
import { useRouteMatch, Route, Switch } from 'react-router-dom';

import { usePermissions } from '@mpieva/psydb-ui-hooks';
import {
    BigNav,
    PermissionDenied,
    PageWrappers
} from '@mpieva/psydb-ui-layout';

import MQMessageHistoryRouting from './mq-message-history';
import RohrpostEventsRouting from './rohrpost-events';

const Routing = (ps) => {
    var permissions = usePermissions();
    if (!permissions.isRoot()) {
        return <PermissionDenied />
    }

    var { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={ path }>
                <PageWrappers.Level1 title='Audit'>
                    <BigNav items={[
                        {
                            label: 'Action History',
                            linkTo: 'mq-message-history'
                        },
                        {
                            label: 'Data Events',
                            linkTo: 'rohrpost-events'
                        },
                    ]} />
                </PageWrappers.Level1>
            </Route>
            <Route path={ `${path}/mq-message-history`}>
                <MQMessageHistoryRouting />
            </Route>
            <Route path={ `${path}/rohrpost-events`}>
                <RohrpostEventsRouting />
            </Route>
        </Switch>
    )
}

export default Routing;
