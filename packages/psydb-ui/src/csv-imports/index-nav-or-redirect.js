import React from 'react';
import { useRouteMatch, Redirect } from 'react-router-dom';
import { entries } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { BigNav } from '@mpieva/psydb-ui-layout';

const IndexNavOrRedirect = (ps) => {
    var {
        canViewSubjectImports,
        canViewExperimentImports,
    } = ps;
    
    var translate = useUITranslation();
    var { url: baseUrl } = useRouteMatch();

    var pflags = {
        canViewSubjectImports,
        canViewExperimentImports,
    }

    var enabledPKeys = [];
    for (var [ key, value ] of entries(pflags)) {
        if (value) { enabledPKeys.push(key) }
    }

    if (enabledPKeys.length === 1) {
        var [ key ] = enabledPKeys;
        return (
            <Redirect to={{
                'canViewSubjectImports': `${baseUrl}/subject`,
                'canViewExperimentImports': `${baseUrl}/participation`,
            }[key]} />
        )
    }

    var navItems = [
        (canViewSubjectImports && { 
            label: translate('Subject Imports'),
            linkUrl: `${baseUrl}/subject`,
        }),
        (canViewExperimentImports && { 
            label: translate('Participation Imports'),
            linkUrl: `${baseUrl}/participation`,
        }),
    ].filter(it => !!it)

    return (
        <BigNav items={ navItems } />
    )
}

export default IndexNavOrRedirect;
