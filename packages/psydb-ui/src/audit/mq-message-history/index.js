import React from 'react';
import { useRouteMatch, Route, Switch } from 'react-router-dom';

import { urlUp } from '@mpieva/psydb-ui-utils';
import { PageWrappers } from '@mpieva/psydb-ui-layout';

import List from './list';
import Details from './details';

const MQMessageHistoryRouting = () => {
    var { url, path } = useRouteMatch();

    return (
        <PageWrappers.Level1
            title='Action History'
            titleLinkUrl={ urlUp(url, 1) }
        >
            <Switch>
                <Route exact path={ `${path}`}>
                    <List />
                </Route>
                <Route exact path={ `${path}/:id`}>
                    <Details />
                </Route>
            </Switch>
        </PageWrappers.Level1>
    )
}

export default MQMessageHistoryRouting;
