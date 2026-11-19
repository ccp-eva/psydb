import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { BigNav } from '@mpieva/psydb-ui-layout';

const IndexNav = (ps) => {
    var [{ translate }] = useI18N();
    var { url: baseUrl } = useRouteMatch();

    var navItems = [
        { 
            label: translate('Study Statistics'),
            linkUrl: `${baseUrl}/study/filters`,
        },
        /*{ 
            label: translate('Subject Statistics'),
            linkUrl: `${baseUrl}/subject/filters`,
        },*/
    ];

    return (
        <BigNav items={ navItems } />
    )
}

export default IndexNav;
