import React from 'react';
import { useRouteMatch  } from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useUIConfig, useI18N } from '@mpieva/psydb-ui-contexts';
import { DetailsBox } from '@mpieva/psydb-ui-layout';

import { withRecordDetails } from '@mpieva/psydb-ui-lib';
import { Study } from '@mpieva/psydb-ui-lib/data-viewers';
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';

export const DetailsBody = (ps) => {
    var {
        fetched,
        permissions
    } = ps;
    
    var { record, crtSettings, related } = fetched;
    
    var { url } = useRouteMatch();
    var { dev_enableWKPRCPatches: IS_WKPRC } = useUIConfig();
    var [{ translate }] = useI18N();
    
    var canEdit = permissions.hasCollectionFlag('study', 'write');
    
    var studyBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        crtSettings,
        related
    };

    var isHidden = record.state.systemPermissions?.isHidden;

    //var title = `${crtSettings.label} Datensatz-Details`;
    var title = translate('Study Details');
    return (
        <DetailsBox
            title={ title }
            editUrl={ `${up(url, 1)}/edit` }
            canEdit= { canEdit }
            isRecordHidden={ isHidden }
        >
            <Study { ...studyBag }>
                <Study.SequenceNumber />
                <Study.Name />
                { !IS_WKPRC && (
                    <Study.Shorthand />
                )}
                <hr />
                <Study.Start />
                <Study.End />
                { !IS_WKPRC && (
                    <Study.EnableFollowUpExperiments />
                )}
                <Study.ResearchGroupIds />
                <Study.ScientistIds />
                <Study.StudyTopicIds />
                { IS_WKPRC && (
                    <Study.ExperimentNames />
                )}
                <Study.Custom />
                <hr />
                <Study.SystemPermissions />
            </Study>
        </DetailsBox>
    )
}

export const RecordDetails = withRecordDetails({
    DetailsBody,
    shouldFetchSchema: false,
});
