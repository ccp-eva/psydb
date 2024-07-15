import React from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { PageWrappers } from '@mpieva/psydb-ui-layout';

import List from './list';
import Details from './details';

const ExperimentImportRouting = (ps) => {
    var { url, path } = useRouteMatch();
    var translate = useUITranslation();

    return (
        <PageWrappers.Level2
            title={ translate('Participation Imports') }
            titleLinkUrl={ url }
        >
            <Switch>
                <Route exact path={ path }>
                    <List />
                </Route>
                <Route path={ `${path}/:id` }>
                    <Details />
                </Route>
            </Switch>
        </PageWrappers.Level2>
    )
}

export default ExperimentImportRouting;
