import React from 'react';

import { keyBy } from '@mpieva/psydb-core-utils';
import { fixRelated } from '@mpieva/psydb-ui-utils';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import { useFormikContext } from '../../../../formik';

import * as Fields from './fields';
import { InviteFields } from './invite-fields';
import { AwayTeamFields } from './away-team-fields';
import { OnlineSurveyFields } from './online-survey-fields';
import { ApestudiesWKPRCDefaultFields } from './apestudies-wkprc-default-fields';



export const LabProcedureFields = (ps) => {
    var {
        studyId,
        fetchedSettings,

        subjectType,
        subjectIds,
        
        enableTeamSelect,
    } = ps;

    var { values, setFieldValue, dirty: isFormDirty } = useFormikContext();
    var { labProcedureType } = values['$'];

    var { records, related } = fixRelated(fetchedSettings.data);
    var settings = records.find(it => (
        it.type === labProcedureType
        && it.state.subjectTypeKey === subjectType
    ));

    var [ didFetchStudy, fetchedStudy ] = useFetch((agent) => (
        studyId
        ? agent.readRecord({
            collection: 'study',
            id: studyId
        })
        : undefined
    ), [ studyId ]);

    if (!didFetchStudy) {
        return <LoadingIndicator size='lg' />
    }

    var { record: study } = fetchedStudy.data;

    return (
        <>
            <TypeFields
                enableTeamSelect={ enableTeamSelect }
                settings={ settings }
                related={ related }
               
                studyId={ studyId }
                subjectIds={ subjectIds }
                subjectType={ subjectType }
            />
            { 
                values['$'].labProcedureType !== 'apestudies-wkprc-default'
                && study.state.enableFollowUpExperiments
                && (
                    <Fields.DefaultBool
                        dataXPath='$.excludeFromMoreExperimentsInStudy'
                        label='Ist Letzter Termin'
                    />
                )
            }
        </>
    )
}

const TypeFields = (ps) => {
    var { type } = ps.settings;
    switch (type) {
        case 'inhouse':
        case 'online-video-call':
            return <InviteFields { ...ps } />
        case 'away-team':
            return <AwayTeamFields { ...ps } />
        case 'online-survey':
            return <OnlineSurveyFields { ...ps } />
        case 'apestudies-wkprc-default':
            return <ApestudiesWKPRCDefaultFields { ...ps } />
        default:
            return null;
    }
}

