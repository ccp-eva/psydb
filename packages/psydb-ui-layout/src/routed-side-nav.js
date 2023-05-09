import React from 'react';
import { useRouteMatch, useHistory, useParams } from 'react-router-dom';
import { urlUp as up } from '@mpieva/psydb-ui-utils';

import SideNav from './side-nav';

const RoutedSideNav = (ps) => {
    var { param, ...pass } = ps;

    var { path, url } = useRouteMatch();
    var params = useParams();
    var history = useHistory();

    var value = params[param];

    return (
        <SideNav
            activeKey={ value }
            onItemClick={ (key) => {
                history.push(`${up(url, 1)}/${key}`);
            }}
            { ...pass }
        />
    );
}

export default RoutedSideNav;
