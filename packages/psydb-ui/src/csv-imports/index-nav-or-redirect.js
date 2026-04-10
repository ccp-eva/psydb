import React from 'react';
import { useRouteMatch, Redirect } from 'react-router-dom';
import { entries } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { BigNav } from '@mpieva/psydb-ui-layout';

const IndexNavOrRedirect = (ps) => {
    var {
        canViewSubjectImports,
        canViewExperimentImports,
        canViewSubjectContactHistoryImports,
    } = ps;
    
    var [{ translate }] = useI18N();
    var { url: baseUrl } = useRouteMatch();

    var pflags = {
        canViewSubjectImports,
        canViewExperimentImports,
        canViewSubjectContactHistoryImports,
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
                'canViewSubjectContactHistoryImports': `${baseUrl}/subject-contact-history`
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
        (canViewSubjectContactHistoryImports && { 
            label: translate('Subject Contact History Imports'),
            linkUrl: `${baseUrl}/subject-contact-history`,
        }),
    ].filter(it => !!it)

    return (
        <BigNav items={ navItems } />
    )
}

export default IndexNavOrRedirect;
