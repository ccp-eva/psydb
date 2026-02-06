import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { BigNav } from '@mpieva/psydb-ui-layout';

const IndexNav = (ps) => {
    var translate = useUITranslation();
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
