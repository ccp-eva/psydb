import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ErrorBoundary } from '@mpieva/psydb-ui-lib';

import StudyConsentDoc from './study-consent-doc';

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

var Routing = () => (
    <>
        <Route
            path='/study-consent-doc'
            component={ withEB(StudyConsentDoc.FullScreenCreator) }
        />
    </>
)

export default FullScreenRoutes;
