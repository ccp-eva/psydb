import React, { useState } from 'react';
import jsonpointer from 'jsonpointer';

import { keyBy } from '@mpieva/psydb-core-utils';
import { fixRelated } from '@mpieva/psydb-ui-utils';
import { useFetch, useFetchAll } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import * as enums from '@mpieva/psydb-schema-enums';

import {
    DefaultForm,
    Fields,
} from '../../../formik';

import { InviteFields } from './invite-fields';
import { AwayTeamFields } from './away-team-fields';

export const LabProcedureFields = (ps) => {
    var {
        subjectType,
        subjectId,
        studyId,
        
        enableTeamSelect,
        formikForm
    } = ps;

    var { setFieldValue } = formikForm;
    var { labProcedureType } = formikForm.values['$'];

    var [ didFetch, fetched ] = useFetch((agent) => (
        studyId && subjectType
        ? agent.fetchExperimentVariantSettings({
            studyId, subjectType
        })
        : undefined
    ), {
        extraEffect: (response) => {
            console.log('EFFECT')
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

    if (!didFetch || !fetched.data) {
        return (
            <TypeSelect
                formikForm={ formikForm }
                settingsByType={ settingsByType }
                types={[]}
                disabled
            />
        )
    }

    var { records, related } = fixRelated(fetched.data);

    var settingsByType = keyBy({ items: records, byProp: 'type' });
    var types = Object.keys(settingsByType);

    return (
        <>
            { 
                labProcedureType !== 'online-survey' && enableTeamSelect
                ? (
                    <OpsTeamSelect
                        studyId={ studyId }
                        disabled={ !subjectId }
                    />
                )
                : (
                    <Fields.ForeignIdList
                        label='Experimenter'
                        dataXPath='$.experimentOperatorIds'
                        collection='personnel'
                    />
                )
            }

            <TypeSelect
                formikForm={ formikForm }
                settingsByType={ settingsByType }
                types={ types }
                disabled={ !subjectId }
            />
            { labProcedureType && (
                <TypeFields
                    settings={ settingsByType[labProcedureType] }
                    related={ related }
                    
                    subjectId={ subjectId }
                    subjectType={ subjectType }
                    formikForm={ formikForm }
                />
            )}
        </>
    )
}

const TypeSelect = (ps) => {
    var { formikForm, settingsByType, types, disabled } = ps;
    var { setFieldValue } = formikForm;

    return (
        <Fields.GenericEnum
            label='Ablauf-Typ'
            dataXPath='$.labProcedureType'
            options={ types.reduce((acc, it) => ({
                ...acc, [it]: enums.experimentVariants.getLabel(it)
            }), {}) }
            extraOnChange={(next) => {
                if (next === 'online-survey') {
                    setFieldValue('$.experimentOperatorTeamId', undefined);
                    setFieldValue('$.experimentOperatorIds', undefined);
                }
                setFieldValue('$.locationId', undefined);
                
                if (['inhouse', 'online-video-call'].includes(next)) {
                    var settings = settingsByType[next];
                    var { locations } = settings.state;
                    if (locations.length === 1) {
                        var { locationId } = locations[0];
                        setFieldValue('$.locationId', locationId);
                    }
                }
            }}
            disabled={ disabled }
        />
    )
}

const TypeFields = (ps) => {
    var { type } = ps.settings;

    if (['inhouse', 'online-video-call'].includes(type)) {
        return (
            <InviteFields { ...ps } />
        )
    }
    if (['away-team'].includes(type)) {
        return (
            <AwayTeamFields { ...ps } />
        );
    }
    else {
        return null;
    }
}

const OpsTeamSelect = (ps) => {
    var { studyId, disabled } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchExperimentOperatorTeamsForStudy({ studyId })
    ), [ studyId ])

    if (!didFetch) {
        return null;
    }

    return (
        <Fields.OpsTeamSelect
            label='Team'
            dataXPath='$.experimentOperatorTeamId'
            teamRecords={ fetched.data.records }
            disabled={ disabled }
        />
    )
}

