import React from 'react';
import camelcase from 'camelcase';

import { useRouteMatch  } from 'react-router-dom';
import { withRecordDetails } from '@mpieva/psydb-ui-lib';
import { DetailsBox } from '@mpieva/psydb-ui-layout';
import { urlUp as up } from '@mpieva/psydb-ui-utils';

import { SystemRole } from '@mpieva/psydb-ui-lib/data-viewers';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';

const cc = (str) => camelcase(str, {
    pascalCase: true,
    preserveConsecutiveUppercase: true
})

export const DetailsBody = (ps) => {
    var {
        fetched,
        permissions
    } = ps;
    
    var { record, crtSettings, related } = fetched;
    var { url } = useRouteMatch();
    
    var canEdit = permissions.hasCollectionFlag(
        'systemRole', 'write'
    );

    var systemRoleBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        crtSettings,
        related
    }

    //var title = `${crtSettings.label} Datensatz-Details`;
    var title = 'Datensatz-Details';
    return (
        <DetailsBox
            title={ title }
            editUrl={ `${up(url, 1)}/edit` }
            canEdit= { canEdit }
        >
            <SystemRole { ...systemRoleBag }>
                <SystemRole.SequenceNumber />
                <SystemRole.Name />
                <hr />
                <BaseFlags />
                <AllLabOpsFlags />
            </SystemRole>
        </DetailsBox>
    )
}

const BaseFlags = (ps) => {
    return (
        Object.keys(SystemRole)
        .filter(key => (
            !['SequenceNumber', 'Name'].includes(key)
            && !key.startsWith('LabOperation')
        ))
        .map(key => {
            var Component = SystemRole[key];
            return <Component key={ key } />
        })
    )
}

const AllLabOpsFlags = (ps) => {
    return (
        [
            [ 'inhouse', 'Interne Termine' ],
            [ 'away-team', 'Externe Termine' ],
            [ 'online-video-call', 'Online-Video-Termine' ],
            [ 'online-survey', 'Online-Umfrage' ]
        ]
        .map(([ type, title ], ix) => (
            <div key={ ix }>
                <OpsHeader>{ title }</OpsHeader>
                <TypedLabOpsFlags type={ type } />
            </div>
        ))
    )
}

const TypedLabOpsFlags = (ps) => {
    var { type } = ps;
    return (
        Object.keys(SystemRole)
        .filter(key => (
            key.startsWith('LabOperation' + cc(type))
        ))
        .map(key => {
            var Component = SystemRole[key];
            return <Component key={ key } />
        })
    )
}

const OpsHeader = (ps) => {
    var { children } = ps;
    return (
        <div className='ml-0 mr-0'>
            <h5 className='mt-4 mb-2 pb-1 border-bottom'>
                { children }
            </h5>
        </div>
    )
}

export const RecordDetails = withRecordDetails({
    DetailsBody,
    shouldFetchCRTSettings: false,
    shouldFetchSchema: false,
});
