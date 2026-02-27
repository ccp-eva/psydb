import React from 'react';
import camelcase from 'camelcase';

import { useRouteMatch  } from 'react-router-dom';
import { ucfirst } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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

    var translate = useUITranslation();

    //var title = `${crtSettings.label} Datensatz-Details`;
    var title = translate('System Role Details');
    return (
        <DetailsBox
            title={ title }
            editUrl={ `${up(url, 1)}/edit` }
            canEdit= { canEdit }
        >
            <SystemRole { ...systemRoleBag }>
                <SystemRole.SequenceNumber />
                <SystemRole.Name />
                
                <MainHeader>
                    { translate('General Permissions') }
                </MainHeader>
                <PermBox title={ translate('Locations') }>
                    <Bool
                        dataXPath='CanReadLocations'
                    />
                    <Bool
                        dataXPath='CanWriteLocations'
                    />
                    <Bool
                        dataXPath='CanRemoveLocations'
                    />
                </PermBox>

                <PermBox title={ translate('External Persons') }>
                    <Bool
                        dataXPath='canReadExternalPersons'
                    />
                    <Bool
                        dataXPath='canWriteExternalPersons'
                    />
                    <Bool
                        dataXPath='canRemoveExternalPersons'
                    />
                </PermBox>
                
                    <PermBox title={ translate('External Organizations') }>
                    <Bool
                        dataXPath='canReadExternalOrganizations'
                    />
                    <Bool
                        dataXPath='canWriteExternalOrganizations'
                    />
                    <Bool
                        dataXPath='canRemoveExternalOrganizations'
                    />
                </PermBox>
            
                <PermBox title={ translate('Study Topics') }>
                    <Bool
                        dataXPath='canReadStudyTopics'
                    />
                    <Bool
                        dataXPath='canWriteStudyTopics'
                    />
                    <Bool
                        dataXPath='canRemoveStudyTopics'
                    />
                </PermBox>
                
                <PermBox title={ translate('Helper Tables') }>
                    <Bool
                        dataXPath='canReadHelperSets'
                    />
                    <Bool
                        dataXPath='canWriteHelperSets'
                    />
                    <Bool
                        dataXPath='canRemoveHelperSets'
                    />
                </PermBox>

                <PermBox title={ translate('Staff Members') }>
                    <Bool
                        dataXPath='canReadPersonnel'
                    />
                    <Bool
                        dataXPath='canWritePersonnel'
                    />
                    <Bool
                        dataXPath='canAllowLogin'
                    />
                    <Bool
                        dataXPath='canSetPersonnelPassword'
                    />
                </PermBox>

                <PermBox title={ translate('Studies') }>
                    <Bool
                        dataXPath='canReadStudies'
                    />
                    <Bool
                        dataXPath='canWriteStudies'
                    />
                    <Bool
                        dataXPath='canRemoveStudies'
                    />
                    <Bool
                        dataXPath='canViewStudyLabOpsSettings'
                    />
                    <Bool
                        dataXPath='canViewStudyLabTeams'
                    />
                </PermBox>

                <PermBox title={ translate('Subjects') }>
                    <Bool
                        dataXPath='canReadSubjects'
                    />
                    <Bool
                        dataXPath='canWriteSubjects'
                    />
                    <Bool
                        dataXPath='canRemoveSubjects'
                    />
                </PermBox>

                <PermBox title={ translate('Subject Groups') }>
                    <Bool
                        dataXPath='canReadSubjectGroups'
                    />
                    <Bool
                        dataXPath='canWriteSubjectGroups'
                    />
                    <Bool
                        dataXPath='canRemoveSubjectGroups'
                    />
                </PermBox>

                <PermBox title={ translate('Study Participation') }>
                    <Bool
                        dataXPath='canReadParticipation'
                    />
                    <Bool
                        dataXPath='canWriteParticipation'
                    />
                </PermBox>

                <PermBox title={ translate('General Scheduling') }>
                    <Bool
                        dataXPath='canCreateReservationsWithinTheNext3Days'
                    />
                    <Bool
                        dataXPath='canCreateExperimentsWithinTheNext3Days'
                    />
                </PermBox>

                <PermBox title={ translate('Advanced Functions') }>
                    <Bool
                        dataXPath='canUseExtendedSearch'
                    />
                    <Bool
                        dataXPath='canUseCSVExport'
                    />
                    <Bool
                        dataXPath='canAccessSensitiveFields'
                    />
                    <Bool
                        dataXPath='canViewReceptionCalendar'
                    />
                </PermBox>

                <MainHeader>
                    { translate('Lab Workflow Related Permissions') }
                </MainHeader>
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

const Bool = (ps) => {
    var { dataXPath } = ps;
    var Component = SystemRole[ucfirst(dataXPath)];
    return <Component />
}

const AllLabOpsFlags = (ps) => {
    var translate = useUITranslation();
    return (
        [
            [ 'inhouse', translate('Inhouse Appointments') ],
            [ 'away-team', translate('External Appointments') ],
            [ 'online-video-call', translate('Online Video Appointments') ],
            [ 'online-survey', translate('Online Survey') ]
        ]
        .map(([ type, title ], ix) => (
            <PermBox title={ title } key={ ix }>
                <TypedLabOpsFlags type={ type } />
            </PermBox>
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

const MainHeader = (ps) => {
    var { children } = ps;
    return (
        <div className='row ml-0 mr-0'>
            <h5 className='col-sm-12 mt-4 mb-3 pb-1 border-bottom'>
                { children }
            </h5>
        </div>
    )
}

const PermBox = (ps) => {
    var { title, children } = ps;
    return (
        <div className='row ml-0 mr-0'>
            <h6 className='col-sm-12 mb-0 pb-1'>
                { title }
            </h6>
            <div className='col-sm-12 border px-3 pt-2 pb-2 mb-4'>
                { children }
            </div>
        </div>
    )
}

export const RecordDetails = withRecordDetails({
    DetailsBody,
    shouldFetchCRTSettings: false,
    shouldFetchSchema: false,
});
