import React from 'react';
import enums from '@mpieva/psydb-schema-enums';

import { __fixRelated } from '@mpieva/psydb-common-compat';
import { Fields } from '@mpieva/psydb-custom-fields-common';
import { useI18N } from '@mpieva/psydb-ui-contexts';

import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Container } from '@mpieva/psydb-ui-layout';
import { formatDateInterval } from '@mpieva/psydb-ui-lib';

import InviteVariant from './invite-variant';
import OnlineSurveyVariant from './online-survey-variant';
import AwayTeamVariant from './away-team-variant';

const General = (ps) => {
    var {
        experimentData,
        opsTeamData,
        locationData,
        studyData,
        onSuccessfulUpdate
    } = ps;
    
    var [ i18n ] = useI18N();
    var permissions = usePermissions();

    // FIXME
    experimentData = __fixRelated(experimentData);
    studyData = __fixRelated(studyData);

    var { shorthand, researchGroupIds } = studyData.record.state;
    var { _id: experimentId, type, realType, state: {
        interval, comment
    }} = experimentData.record;

    var t = realType || type;

    var firstResearchGroupId = (
        permissions.isRoot()
        ? researchGroupIds[0]
        : permissions.getResearchGroupIds(researchGroupIds).shift()
    );

    var isInviteExperiment = (
        enums.inviteLabMethods.keys.includes(t)
    );

    var {
        startDate, startTime,
        endDate, endTime
    } = formatDateInterval(interval);

    var researchGroupLabel = Fields.ForeignIdList.stringifyValue({
        value: researchGroupIds, related: studyData.related, i18n,
        definition: { props: { collection: 'researchGroup' }}
    });

    var sharedBag = {
        experimentId,
        experimentTypeLabel: enums.labMethods.mapping[t],
        studyLabel: shorthand,
        firstResearchGroupId,
        researchGroupLabel,
        interval,
        locationData,
        opsTeamData,

        onSuccessfulUpdate
    }

    var content = null;
    if (t === 'online-survey') {
        content = (
            <OnlineSurveyVariant { ...sharedBag } />
        );
    }
    else if (isInviteExperiment) {
        content = (
            <InviteVariant { ...sharedBag } />
        );
    }
    else {
        content = (
            <AwayTeamVariant { ...sharedBag } comment={ comment } />
        );
    }

    return (
        <Container>{ content }</Container>
    );
}




export default General;
