import React from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { useUIConfig } from '@mpieva/psydb-ui-contexts';
import PageWrapper from './page-wrapper';
import IndexNav from './index-nav';

import StudyStatisticsRouting from './study';

const StatisticsRouting = () => {
    var { url, path } = useRouteMatch();

    return (
        <PageWrapper>
            <Switch>
                <Route exact path={ path }>
                    <IndexNav />
                </Route>
                <Route path={ `${path}/study` }>
                    <StudyStatisticsRouting />
                </Route>
                <Route path={ `${path}/subject` }>
                    {/*<SubjectImportRouting />*/}
                </Route>
            </Switch>
        </PageWrapper>
    )
}

export default StatisticsRouting;
