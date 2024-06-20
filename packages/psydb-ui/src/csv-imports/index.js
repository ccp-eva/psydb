import React from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import PageWrapper from './page-wrapper';
import IndexNavOrRedirect from './index-nav-or-redirect';
import ExperimentImportRouting from './experiment-imports';
import SubjectImportRouting from './subject-imports';

const CSVImportRouting = () => {
    var { url, path } = useRouteMatch();

    var pflags = {
        canViewSubjectImports: false,
        canViewExperimentImports: true,
    }

    return (
        <PageWrapper>
            <Switch>
                <Route exact path={ path }>
                    <IndexNavOrRedirect { ...pflags } />
                </Route>
                <Route path={ `${path}/participation` }>
                    <ExperimentImportRouting />
                </Route>
                <Route path={ `${path}/subject` }>
                    <SubjectImportRouting />
                </Route>
            </Switch>
        </PageWrapper>
    )
}

export default CSVImportRouting;
