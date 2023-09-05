import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { BigNav } from '@mpieva/psydb-ui-layout';

const IndexNav = (ps) => {
    var {
        canSelectInhouse,
        canSelectAwayTeam,
        canSelectVideo,
        canSelectOnlineSurvey,
    } = ps;
    
    var translate = useUITranslation();
    var { url } = useRouteMatch();
    
    var baseUrl = up(url, 2);

    var navItems = [
        (canSelectInhouse && {
            key: 'inhouse',
            label: translate('Inhouse Study'),
            linkTo: 'inhouse'
        }), 
        (canSelectAwayTeam && {
            key: 'away-team',
            label: translate('External Study'),
            linkTo: 'away-team'
        }),
        (canSelectVideo && {
            key: 'online-video-call',
            label: 'Online Video Call',
            linkTo: 'online-video-call'
        }),
        (canSelectOnlineSurvey && {
            key: 'online-survey',
            label: 'Online Survey',
            linkTo: 'online-survey'
        }),
    ].filter(it => !!it)

    return (
        <BigNav items={ navItems } />
    )
}

export default IndexNav;
