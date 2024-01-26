import React from 'react';

import { merge, unique, only } from '@mpieva/psydb-core-utils';
import * as enums from '@mpieva/psydb-schema-enums';

import { fixRelated } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';
import {
    LoadingIndicator,
    FormHelpers,
    Alert,
    PaddedText
} from '@mpieva/psydb-ui-layout';

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
            <FormHelpers.InlineWrapper
                label={ translate('Lab Workflow Type') }
            >
                <PaddedText><b>
                    { translate(`_labWorkflow_${labMethodKey}`) }
                </b></PaddedText>
            </FormHelpers.InlineWrapper>
            { FormContainer && (
                <FormContainer.Component
                    useAjvAsync
                    ajvErrorInstancePathPrefix='/payload'
                    onSubmit={ send.exec }
                    isTransmitting={ send.isTransmitting }

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
    
    // XXX: that wont work when no subjects or multiple subject types
    labMethodSettings = (
        labMethodSettings
        //.filter(it => subjectTypes.includes(it.state.subjectTypeKey))
    )[0];

    var related = merge(
        experimentRelated, studyRelated, labMethodSettingsRelated
    );

    return {
        didFetch,
        subjectType: labMethodSettings.state.subjectTypeKey,
        experiment, study, labMethodSettings,
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
