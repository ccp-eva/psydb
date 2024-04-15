import React from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { PageWrappers } from '@mpieva/psydb-ui-layout';

import List from './list';

const ExperimentImportRouting = (ps) => {
    var { url, path } = useRouteMatch();
    var translate = useUITranslation();

    return (
        <PageWrappers.Level2
            title={ translate('Participation Imports') }
            titleLinkUrl={ url }
        >
            <Switch exact path={ path }>
                <List />
            </Switch>
        </PageWrappers.Level2>
    )
}

export default ExperimentImportRouting;
