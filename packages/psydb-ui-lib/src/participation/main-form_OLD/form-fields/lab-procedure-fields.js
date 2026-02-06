import React from 'react';

import { keyBy } from '@mpieva/psydb-core-utils';
import { __fixRelated } from '@mpieva/psydb-common-compat';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';

import { useFormikContext } from '../../../formik';

import * as Fields from './fields';
import { InviteFields } from './invite-fields';
import { AwayTeamFields } from './away-team-fields';
import { OnlineSurveyFields } from './online-survey-fields';



export const LabProcedureFields = (ps) => {
    var {
        subjectType,
        subjectId,
        studyId,
        
        enableTeamSelect,
    } = ps;

    var translate = useUITranslation();

    var { values, setFieldValue, dirty: isFormDirty } = useFormikContext();
    var { labProcedureType } = values['$'];

    var [ didFetchSettings, fetchedSettings ] = useFetch((agent) => (
        studyId && subjectType
        ? agent.fetchExperimentVariantSettings({
            studyId, subjectType
        })
        : undefined
    ), {
        extraEffect: (response) => {
            if (!isFormDirty) {
                return;
            }
            var { data } = response.data;
            setFieldValue('$.experimentOperatorTeamId', undefined);
            setFieldValue('$.experimentOperatorIds', undefined);

            if (data.records.length === 1) {
                var [ settings ] = data.records;
                var { type, state } = settings;
                setFieldValue('$.labProcedureType', type);

                if (['inhouse', 'online-video-call'].includes(type)) {
                    var { locations } = settings.state;
                    if (locations.length === 1) {
                        var { locationId } = locations[0];
                        setFieldValue('$.locationId', locationId);
                    }
                }
            }
            else {
                setFieldValue('$.labProcedureType', undefined);
                setFieldValue('$.locationId', undefined);
            }
        },
        dependencies: [ studyId, subjectType ]
    });

    var [ didFetchStudy, fetchedStudy ] = useFetch((agent) => (
        studyId
        ? agent.readRecord({
            collection: 'study',
            id: studyId
        })
        : undefined
    ), [ studyId ]);

    var [ didFetchSubject, fetchedSubject ] = useFetch((agent) => (
        subjectId
        ? agent.readRecord({
            collection: 'subject',
            id: subjectId
        })
        : undefined
    ), [ subjectId ]);

    var shouldShowFallback = (
        !didFetchSettings || !fetchedSettings.data
        || !didFetchStudy || !fetchedStudy.data
        || !didFetchSubject || !fetchedSubject.data
    );

    if (shouldShowFallback) {
        return (
            <Fields.LabProcedureType
                settingsByType={ settingsByType }
                types={[]}
                disabled
            />
        )
    }

    var { record: study } = fetchedStudy.data;
    var { record: subject } = fetchedSubject.data;

    var { records, related } = __fixRelated(fetchedSettings.data);

    var settingsByType = keyBy({ items: records, byProp: 'type' });
    var types = Object.keys(settingsByType);

    return (
        <>
            <Fields.LabProcedureType
                settingsByType={ settingsByType }
                types={ types }
                disabled={ !subjectId }
            />
            { labProcedureType && (
                <>
                    <TypeFields
                        enableTeamSelect={ enableTeamSelect }
                        settings={ settingsByType[labProcedureType] }
                        related={ related }
                       
                        studyId={ studyId }
                        subjectId={ subjectId }
                        subjectType={ subjectType }
                    />
                    { study.state.enableFollowUpExperiments && (
                        <Fields.DefaultBool
                            dataXPath='$.excludeFromMoreExperimentsInStudy'
                            label={ translate('Last Appointment?') }
                        />
                    )}
                </>
            )}
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
        default:
            return null;
    }
}

