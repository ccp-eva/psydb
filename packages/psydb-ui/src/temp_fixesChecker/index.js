import React from 'react';
import {
    useRouteMatch,
    Route,
    Switch,
   // Redirect, // TODO
} from 'react-router-dom';

import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { BigNav } from '@mpieva/psydb-ui-layout';

import FixedAddEventList from './fixed-add-event-list';
import FixedAddEventDetails from './fixed-add-event-details';

import FixedImportEventList from './fixed-import-event-list';
import FixedImportEventDetails from './fixed-import-event-details';

import FixedPatchEventList from './fixed-patch-event-list';
import FixedPatchEventDetails from './fixed-patch-event-details';

const Routing = (ps) => {
    var permissions = usePermissions();
    if (!permissions.isRoot()) {
        return null
    }
   
    var { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={ path }>
                <BigNav items={[
                    {
                        label: 'Fixed Add-Events',
                        linkTo: 'fixed-add-events'
                    },
                    {
                        label: 'Fixed Import-Events',
                        linkTo: 'fixed-import-events'
                    },
                    {
                        label: 'Fixed Patch-Events',
                        linkTo: 'fixed-patch-events'
                    },
                ]} />
            </Route>
            <Route exact path={ `${path}/fixed-add-events`}>
                <FixedAddEventList />
            </Route>
            <Route exact path={ `${path}/fixed-add-events/:id`}>
                <FixedAddEventDetails />
            </Route>
            
            <Route exact path={ `${path}/fixed-import-events`}>
                <FixedImportEventList />
            </Route>
            <Route exact path={ `${path}/fixed-import-events/:id`}>
                <FixedImportEventDetails />
            </Route>
            
            <Route exact path={ `${path}/fixed-patch-events`}>
                <FixedPatchEventList />
            </Route>
            <Route exact path={ `${path}/fixed-patch-events/:id`}>
                <FixedPatchEventDetails />
            </Route>
        </Switch>
    )    
}

export default Routing;
