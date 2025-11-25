import React from 'react';
import { useRouteMatch } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { ErrorBoundary } from '@mpieva/psydb-ui-lib';

import * as StudyConsentDoc from './study-consent-doc';

const FullScreenRoutes = (ps) => {
    return (
        <main>
            <Routing />
        </main>
    );
}

var withEB = (Component) => (ps) => (
    <ErrorBoundary>
        <Component { ...ps } />
    </ErrorBoundary>
);

var Routing = (ps) => {
    var { path } = useRouteMatch();
    return (
        <Switch>
            <Route
                path={ `${path}/study-consent-doc/fill` }
                component={ withEB(StudyConsentDoc.FullScreenCreator) }
            />
            <Route
                path={ `${path}/study-consent-doc/success` }
                component={ withEB(StudyConsentDoc.FullScreenSuccess) }
            />
        </Switch>
    )
}

export default FullScreenRoutes;
