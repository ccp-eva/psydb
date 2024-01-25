import React, { useState } from 'react';

import { only, unique, hasOnlyOne } from '@mpieva/psydb-core-utils';
import { fixRelated } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, FormHelpers } from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';
import * as enums from '@mpieva/psydb-schema-enums';

import InviteForm from './invite-form';
import AwayTeamForm from './away-team-form';
import OnlineSurveyForm from './online-survey-form';
import ApestudiesWKPRCDefaultForm from './apestudies-wkprc-default-form';
import ManualOnlyParticipationForm from './manual-only-participation-form';


const ExperimentCreateForm = (ps) => {
    var {
        studyId,
        preselectedSubjectId = undefined,
        preselectedSubject = undefined,
        subjectsAreTestedTogetherOverride = undefined,
        enableTeamSelect = false
    } = ps;

    var {
        didFetch, labMethodSettings, labMethodSettingsRelated,
        labMethodKey, setLabMethodKey,
        send
    } = fromHooks(ps);

    var translate = useUITranslation();

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var enabledLabMethodKeys = unique(labMethodSettings.map(it => it.type));
    var showLabMethodSelect = true;
    if (hasOnlyOne(enabledLabMethodKeys)) {
        labMethodKey = enabledLabMethodKeys[0]
        showLabMethodSelect = false;
    }
    var filteredLabMethodSettings = (
        labMethodKey
        ? labMethodSettings.filter(it => it.type === labMethodKey)
        : []
    );

    var FormContainer = switchFormContainer(labMethodKey);
    return (
        <>
            { showLabMethodSelect && (
                <FormHelpers.InlineWrapper
                    label={ translate('Lab Workflow Type') }
                >
                    <Controls.GenericEnum
                        value={ labMethodKey }
                        onChange={ setLabMethodKey }
                        options={ translate.options(only({
                            from: enums.labMethods.mapping,
                            paths: enabledLabMethodKeys
                        }))}
                    />
                </FormHelpers.InlineWrapper>
            )}
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
                    preselectedSubjectId={ preselectedSubjectId }
                    preselectedSubject={ preselectedSubject }
                    labMethodSettings={ filteredLabMethodSettings }
                    related={ labMethodSettingsRelated }
                    subjectsAreTestedTogetherOverride={
                        subjectsAreTestedTogetherOverride
                    }
                />
            )}
        </>
    )
}

var fromHooks = (ps) => {
    var { studyId, onSuccessfulUpdate } = ps;

    var [ labMethodKey, setLabMethodKey ] = useState();
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchExperimentVariantSettings({
            studyIds: [ studyId ]
        })
    ), {
        dependencies: [ studyId ],
        extraEffect: (response) => {
            var records = response?.data?.data?.records;
            if (records) {
                var enabledLabMethodKeys = unique(records.map(it => it.type));
                if (hasOnlyOne(enabledLabMethodKeys)) {
                    setLabMethodKey(enabledLabMethodKeys[0]);
                }
            }
        }
    });

    var send = useSend((formData) => {
        var { subjectsAreTestedTogether, ...otherFormData } = formData;
        var type = (
            subjectsAreTestedTogether
            ? 'experiment/create-manual'
            : 'experiment/create-manual-for-many-subjects'
        );

        return { type, payload: {
            studyId,
            labMethod: labMethodKey,
            ...otherFormData
        }}
    }, { onSuccessfulUpdate });

    if (!didFetch) {
        return { didFetch }
    }


    var {
        records: labMethodSettings,
        related: labMethodSettingsRelated
    } = fixRelated(fetched.data);

    return {
        didFetch, labMethodSettings, labMethodSettingsRelated,
        labMethodKey, setLabMethodKey,
        send
    }
}

var switchFormContainer = (labMethodKey) => {
    switch (labMethodKey) {
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
