import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useURLSearchParamsB64 } from '@mpieva/psydb-ui-hooks';
import { PageWrappers } from '@mpieva/psydb-ui-layout';

import List from './list';
import Inspector from './inspector';

const DuplicatesRouting = (ps) => {
    var { recordType } = ps;

    var [{ translate }] = useI18N();
    var { url, path } = useRouteMatch();
    var [ query ] = useURLSearchParamsB64();

    return (
        <PageWrappers.Level3
            title={ translate('Duplicates') }
            titleLinkUrl={ query.backlink || url }
        >
            <Switch>
                <Route exact path={`${path}`}>
                    <List recordType={ recordType } />
                </Route>
                <Route exact path={`${path}/inspect`}>
                    <Inspector recordType={ recordType } />
                </Route>
            </Switch>
        </PageWrappers.Level3>
    )
}

export default DuplicatesRouting;
