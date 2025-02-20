import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useI18N } from '@mpieva/psydb-ui-contexts';

import List from './list';
import Inspector from './inspector';

const DuplicatesRouting = (ps) => {
    var { recordType } = ps;

    var { url, path } = useRouteMatch();
    var [{ translate }] = useI18N();

    return (
        <>
            <h4 className='border-bottom'>{ translate('Duplicates') }</h4>
            <Switch>
                <Route exact path={`${path}`}>
                    <List recordType={ recordType } />
                </Route>
                <Route exact path={`${path}/inspect`}>
                    <Inspector recordType={ recordType } />
                </Route>
            </Switch>
        </>
    )
}

export default DuplicatesRouting;
