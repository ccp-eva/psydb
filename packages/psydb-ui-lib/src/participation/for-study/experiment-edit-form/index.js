import React from 'react';
import inline from '@cdxoo/inline-text';

import { merge, unique, only } from '@mpieva/psydb-core-utils';
import { fixRelated } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';
import {
    LoadingIndicator,
    FormHelpers,
    Alert,
    PaddedText
} from '@mpieva/psydb-ui-layout';

import * as Controls from '@mpieva/psydb-ui-form-controls';

import InviteForm from './invite-form';
import AwayTeamForm from './away-team-form';
import OnlineSurveyForm from './online-survey-form';
import ApestudiesWKPRCDefaultForm from './apestudies-wkprc-default-form';
import ManualOnlyParticipationForm from './manual-only-participation-form';

const ExperimentEditForm = (ps) => {
    var { experimentId, labMethodKey } = ps;

    var {
        didFetch,
        subjectType,
        experiment, experimentRelated,
        study, studyRelated,
        labMethodSettings, labMethodSettingsRelated,
        related,
        send
    } = fromHooks(ps);

    var translate = useUITranslation();

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { type, realType } = experiment;
    var { isPostprocessed, isCanceled } = experiment.state;
    var labMethodKey = realType || type;

    if (!isPostprocessed) {
        return <NotPostprocessedAlert />
    }
    
    if (isCanceled) {
        return <IsCanceledAlert />
    }

    var FormContainer = switchFormContainer(labMethodKey);
    //var related = experimentRelated; // TODO: merge related maybe?
    return (
        <>
            { !labMethodSettings && (
                <Alert variant='danger'><b>
                    { translate(inline`
                        WARNING: There is no matching lab workflow
                        setting in this study!
                    `)}
                </b></Alert>
            )}
            <FormHelpers.InlineWrapper
                label={ translate('Lab Workflow Type') }
            >
                <PaddedText><b>
                    { translate(`_labWorkflow_${labMethodKey}`) }
                </b></PaddedText>
            </FormHelpers.InlineWrapper>

            <FormHelpers.InlineWrapper
                label={ translate('Subject Type') }
            >
                <Controls.GenericTypeKey
                    collection='subject'
                    value={ subjectType }
                    readOnly={ true }
                />
            </FormHelpers.InlineWrapper>

            { FormContainer && (
                <FormContainer.Component
                    useAjvAsync
                    ajvErrorInstancePathPrefix='/payload'
                    onSubmit={ send.exec }
                    isTransmitting={ send.isTransmitting }
                    enableSubmit={ !!labMethodSettings }

                    subjectType={ subjectType }
                    experiment={ experiment }
                    study={ study }
                    labMethodSettings={ labMethodSettings }
                    related={ related }
                />
            )}
        </>
    )
}

var fromHooks = (ps) => {
    var { labMethodKey, experimentId, onSuccessfulUpdate } = ps;
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchExtendedExperimentData({
            experimentType: labMethodKey,
            experimentId,
        })
    ), [ labMethodKey, experimentId ]);

    var send = useSend((formData) => {
        return { type: 'experiment/patch-manual', payload: {
            experimentId,
            ...formData
        }}
    }, { onSuccessfulUpdate });

    if (!didFetch) {
        return { didFetch }
    }

    var {
        record: experiment,
        related: experimentRelated,
    } = fixRelated(fetched.data.experimentData);

    var {
        record: study,
        related: studyRelated
    } = fixRelated(fetched.data.studyData);

    var {
        records: labMethodSettings,
        related: labMethodSettingsRelated
    } = fixRelated(fetched.data.labProcedureSettingData);

    var subjectTypes = unique(experiment.state.subjectData.map(it => (
        it.subjectType
    )));

    var subjectType = subjectTypes[0];
    var usedLabMethodSettings = undefined;
    if (labMethodSettings) {
        if (subjectType) {
            var settingsForSubjectType = labMethodSettings.filter(it => (
                it.state.subjectTypeKey === subjectType
            ));
            usedLabMethodSettings = settingsForSubjectType[0];
        }
        if (!usedLabMethodSettings) {
            // XXX: that wont work when no subjects or multiple subject types
            usedLabMethodSettings = labMethodSettings[0];
        }

        if (usedLabMethodSettings && !subjectType) {
            subjectType = labMethodSettings.state.subjectTypeKey;
        }
    }

    var related = merge(
        experimentRelated, studyRelated, labMethodSettingsRelated
    );

    return {
        didFetch,
        subjectType,
        experiment, study, labMethodSettings: usedLabMethodSettings,
        related,
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

const NotPostprocessedAlert = (ps) => {
    return (
        <Alert variant='danger'>
            <b>Termin ist nicht nachbereitet!</b><br/>
            <div>
                Nur Teilnahmen von nachbereitetetn Terminen können manuell
                verändert werden.
            </div>
        </Alert>
    )
}

const IsCanceledAlert = (ps) => {
    return (
        <Alert variant='danger'>
            <b>Termin wurde abgesagt!</b><br/>
            <div>
                Teilnahmen von abgesagten Termine können
                nicht manuell bearbeitet werden.
            </div>
        </Alert>
    )
}
export default ExperimentEditForm;
