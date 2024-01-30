import React, { useState } from 'react';

import { only, unique, hasOnlyOne } from '@mpieva/psydb-core-utils';
import { fixRelated } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, FormHelpers } from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';
import * as enums from '@mpieva/psydb-schema-enums';

import {
    withLabMethodSelect,
    withSubjectTypeSelect,
    maybeAutoSelect
} from './shared';

import InviteForm from './invite-form';
import AwayTeamForm from './away-team-form';
import OnlineSurveyForm from './online-survey-form';
import ApestudiesWKPRCDefaultForm from './apestudies-wkprc-default-form';
import ManualOnlyParticipationForm from './manual-only-participation-form';

const compose = (C) => (
    withLabMethodSelect(withSubjectTypeSelect(C))
)

const ExperimentCreateForm = compose((ps) => {
    var {
        studyId,
        preselectedSubjectId = undefined,
        preselectedSubject = undefined,
        subjectsAreTestedTogetherOverride = undefined,
        enableTeamSelect = false,

        labMethod,
        subjectType,
        specificLabMethodSettings,
        labMethodSettingsRelated,

        onSuccessfulUpdate,
        onFailedUpdate,
    } = ps;

    // XXX
    var filteredLabMethodSettings = [ specificLabMethodSettings ];

    var translate = useUITranslation();

    var send = useSend((formData) => {
        var { subjectsAreTestedTogether, ...otherFormData } = formData;
        var type = (
            subjectsAreTestedTogether
            ? 'experiment/create-manual'
            : 'experiment/create-manual-for-many-subjects'
        );

        return { type, payload: {
            studyId,
            labMethod,
            ...otherFormData
        }}
    }, { onSuccessfulUpdate });

    var FormContainer = switchFormContainer(labMethod);
    return (
        <>
            { FormContainer && (
                <FormContainer.Component
                    useAjvAsync
                    ajvErrorInstancePathPrefix='/payload'
                    onSubmit={ send.exec }
                    isTransmitting={ send.isTransmitting }
                    initialValues={ FormContainer.createDefaults({
                        preselectedSubjectId,
                        preselectedSubject,
                        
                        subjectsAreTestedTogetherOverride,
                        labMethodSettings: filteredLabMethodSettings,
                    }) }

                    studyId={ studyId }
                    enableTeamSelect={ enableTeamSelect }

                    subjectType={ subjectType }
                    labMethod={ labMethod }

                    preselectedSubjectId={ preselectedSubjectId }
                    preselectedSubject={ preselectedSubject }

                    labMethodSettings={ specificLabMethodSettings }
                    related={ labMethodSettingsRelated }
                    subjectsAreTestedTogetherOverride={
                        subjectsAreTestedTogetherOverride
                    }
                />
            )}
        </>
    )
});

var switchFormContainer = (labMethod) => {
    switch (labMethod) {
        case 'inhouse':
        case 'online-video-call':
            return InviteForm;
        case 'away-team':
            return AwayTeamForm;
        case 'online-survey':
            return OnlineSurveyForm;
        case 'apestudies-wkprc-default':
            return ApestudiesWKPRCDefaultForm;
        case 'manual-only-participation':
            return ManualOnlyParticipationForm;
        default:
            return undefined;
    }
}

export default ExperimentCreateForm;
