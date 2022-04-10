import React from 'react';

import { useRouteMatch  } from 'react-router-dom';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { LinkButton, Icons } from '@mpieva/psydb-ui-layout';

import { Study } from '@mpieva/psydb-ui-lib/data-viewers';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';


const EditLinkButton = ({
    to,
    label
}) => {
    return (
        <LinkButton
            className='d-flex align-items-center'
            to={ to }>
            <span className='d-inline-block mr-2'>{ label }</span>
            <Icons.ArrowRightShort style={{ height: '24px', width: '24px' }} />
        </LinkButton>
    );
}

const StudyRecordDetails = (ps) => {
    var {
        fetched,
        recordType,
        onSuccessfulUpdate,
    } = ps;

    var { record, crtSettings, related } = fetched;
    var { path, url } = useRouteMatch();
    var permissions = usePermissions();
    var canEdit = permissions.hasCollectionFlag('study', 'write');

    var studyBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        crtSettings,
        related
    }

    return (
        <div className='m-3 position-relative'>
            <Study { ...studyBag }>
                <Study.SequenceNumber />
                <Study.Name />
                <Study.Shorthand />
                <hr />
                <Study.Start />
                <Study.End />
                <Study.EnableFollowUpExperiments />
                <Study.ResearchGroupIds />
                <Study.ScientistIds />
                <Study.StudyTopicIds />
                <Study.Custom />
                <hr />
                <Study.SystemPermissions />
            </Study>

            { canEdit && (
                <div style={{
                    position: 'absolute', right: '0px', top: '0px'
                }}>
                    <EditLinkButton
                        label='Bearbeiten'
                        to={ `${url}/edit` }
                    />
                </div>
            )}
        </div>
    );
}

export default StudyRecordDetails;
