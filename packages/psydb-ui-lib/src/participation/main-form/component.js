import React, { useState } from 'react';
import jsonpointer from 'jsonpointer';

import { keyBy } from '@mpieva/psydb-core-utils';
import { useFetch, useFetchAll } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import * as enums from '@mpieva/psydb-schema-enums';

import {
    DefaultForm,
    Fields,
} from '../../formik';

export const Component = (ps) => {
    var {
        enableSubjectId,
        subjectTypes,
        enableStudyId,
        studyTypes,

        initialValues,
        onSubmit,
    } = ps;

    var renderedForm = (
        <DefaultForm
            useAjvAsync
            ajvErrorInstancePathPrefix='/payload'
            initialValues={ initialValues }
            onSubmit={ onSubmit }
        >
            {(formikProps) => (
                <>
                    { /*console.log(formikProps.values) || ''*/ }
                    <FormFields { ...({
                        enableSubjectId,
                        subjectTypes,
                        enableStudyId,
                        studyTypes,
                        formikForm: formikProps,
                    }) } />
                    <Button type='submit'>Speichern</Button>
                </>
            )}
        </DefaultForm>
    );

    return renderedForm;
}

const FormFields = (ps) => {
    var {
        enableSubjectId,
        subjectTypes,

        enableStudyId,
        studyTypes,

        formikForm,
    } = ps;

    var {
        studyId,
        subjectId,
        studyType,
        subjectType,
        labProcedureType,
    } = formikForm.values['$'];

    var showStudyTypeSelect = (
        enableStudyId && !(studyTypes.length === 1 && studyType)
    );
    var showSubjectTypeSelect = (
        enableSubjectId && !(subjectTypes.length === 1 && subjectType)
    );

    var [ didFetch, fetched ] = useFetch((agent) => (
        studyId
        ? agent.fetchExperimentVariantSettings({ studyId })
        : undefined
    ), [ studyId ]);

    var opsRelated = (
        didFetch && fetched.data
        ? {
            relatedCRTs: fetched.data.relatedCustomRecordTypes,
            relatedRecords: fetched.data.relatedRecords
        }
        : undefined
    );
    var opsRecords = (
        didFetch && fetched.data
        ? fetched.data.records.filter(it => (
            it.state.subjectTypeKey === subjectType
        ))
        : []
    );
    var opsRecordsByType = keyBy({ items: opsRecords, byProp: 'type' });
    var opsTypes = Object.keys(opsRecordsByType);

    return (
        <>
            { showStudyTypeSelect && (
                <Fields.GenericEnum
                    label='Studien-Typ'
                    dataXPath='$.studyType'
                    options={ studyTypes.reduce((acc, it) => ({
                        ...acc, [it.type]: it.label
                    }), {}) }
                />
            )}
            { enableStudyId && (
                <Fields.ForeignId
                    label='Studie'
                    dataXPath='$.studyId'
                    collection='study'
                    recordType={ studyType }
                />
            )}
            { showSubjectTypeSelect && (
                <Fields.GenericEnum
                    label='Probanden-Typ'
                    dataXPath='$.subjectType'
                    options={ subjectTypes.reduce((acc, it) => ({
                        ...acc, [it.type]: it.label
                    }), {}) }
                />
            )}
            { enableSubjectId && (
                <Fields.ForeignId
                    label='Proband'
                    dataXPath='$.subjectId'
                    collection='subject'
                    recordType={ subjectType }
                />
            )}


            <Fields.DateTime
                label='Test-Zeitpunkt'
                dataXPath='$.timestamp'
                disabled={ !subjectId }
            />
            <Fields.GenericEnum
                label='Status'
                dataXPath='$.status'
                options={{
                    ...enums.inviteParticipationStatus.mapping,
                    ...enums.inviteUnparticipationStatus.mapping,
                }}
                disabled={ !subjectId }
            />

                <Fields.GenericEnum
                    label='Ablauf-Typ'
                    dataXPath='$.labProcedureType'
                    options={ opsTypes.reduce((acc, it) => ({
                        ...acc, [it]: enums.experimentVariants.getLabel(it)
                    }), {}) }
                    disabled={ !subjectId }
                />
            
            { labProcedureType && (
                <LabProcedureFields
                    subjectId={ subjectId }
                    subjectType={ subjectType }
                    settings={ opsRecordsByType[labProcedureType] }
                    related={ opsRelated }
                    formikForm={ formikForm }
                />
            )}
        </>
    );
}

const LabProcedureFields = (ps) => {
    var { subjectId, subjectType, settings, related, formikForm } = ps;
    if (!settings || !related ) {
        return null;
    }
    
    var { type } = settings;
    if (['inhouse', 'online-video-call'].includes(type)) {
        return (
            <InviteFields
                settings={ settings }
                related={ related }
            />
        )
    }
    if (['away-team'].includes(type)) {
        return (
            <AwayTeamFields
                subjectId={ subjectId }
                subjectType={ subjectType }
                settings={ settings }
                related={ related }
                formikForm={ formikForm }
            />
        );
    }
    else {
        return null;
    }

}

const AwayTeamFields = (ps) => {
    var { subjectId, subjectType, settings, formikForm } = ps;
    var { subjectLocationFieldPointer } = settings.state;
    var [ fieldDef, setFieldDef ] = useState();

    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        crtSettings: agent.readCRTSettings({
            collection: 'subject', recordType: subjectType
        }),
        subjectData: agent.readRecord({
            collection: 'subject',
            recordType: subjectType,
            id: subjectId
        })
    }), {
        dependencies: [ subjectType, subjectId ],
        extraEffect: (responses) => {
            var crtSettings = responses.crtSettings.data.data;
            var { record, ...related } = responses.subjectData.data.data;

            var def = crtSettings.fieldDefinitions.scientific.find(it => (
                it.pointer === subjectLocationFieldPointer
            ));
            var locationId = jsonpointer.get(record, def.pointer);

            formikForm.setFieldValue('$.locationId', locationId);
            setFieldDef(def);
        }
    });

    if (!didFetch || !fieldDef) {
        return null;
    }
    var { record, ...related } = fetched.subjectData.data;
    var locationId = jsonpointer.get(record, fieldDef.pointer);
    var locationLabel = (
        related.relatedRecordLabels.location[locationId]._recordLabel
    );

    return (
        <>
            <Fields.GenericEnum
                label={ fieldDef.displayName }
                dataXPath='$.locationId'
                options={{ 
                    ...(locationId && {
                        [locationId]: locationLabel
                    })
                }}
            />
        </>
    )
}

const InviteFields = (ps) => {
    var { settings, related } = ps;
    var { locations } = settings.state;
    var { relatedCRTs, relatedRecords } = related;

    return (
        <>
            <Fields.GenericEnum
                label='Raum'
                dataXPath='$.locationId'
                options={ locations.reduce((acc, it) => {
                    var type = it.customRecordTypeKey;
                    var id = it.locationId;

                    var typeLabel = (
                        relatedCRTs.location[type].state.label
                    );
                    var idLabel = (
                        relatedRecords.location[id]._recordLabel
                    )

                    return { ...acc, [id]: `${typeLabel} - ${idLabel}` }
                }, {}) }
            />
        </>
    );
}
