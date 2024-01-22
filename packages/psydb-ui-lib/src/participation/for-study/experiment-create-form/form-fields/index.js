import React from 'react';
import { entries, groupBy, keyBy, unique } from '@mpieva/psydb-core-utils';
import * as enums from '@mpieva/psydb-schema-enums';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    useFormikContext
} from '../../../../formik';

import { LabProcedureFields } from './lab-procedure-fields';

const undefineKeys = (keys) => (
    keys.reduce((acc, key) => ({
        ...acc, [key]: undefined
    }), {})
)

const setAllValues = (formikContext, nextValues) => {
    var { setFieldValue } = formikContext;
    Object.keys(nextValues).forEach((key) => {
        var value = nextValues[key];
        setFieldValue(key, value)
    });
}

const isInviteMethod = (methodKey) => (
    ['inhouse', 'online-video-call'].includes(methodKey)
)

const hasOnlyOne = (items) => (
    items.length === 1
)

export const FormFields = (ps) => {
    var {
        studyId,
        enableTeamSelect,
    } = ps;

    var formik = useFormikContext();
    var { values, setFieldValue } = formik;
    var { subjectType } = values['$'];

    var [ didFetchSubjectTypes, fetchedSubjectTypes ] = useFetch((agent) => (
        agent.fetchCollectionCRTs({ collection: 'subject' })
    ), []);

    var [ didFetchSettings, fetchedSettings ] = useFetch((agent) => (
        agent.fetchExperimentVariantSettings({
            studyIds: [ studyId ]
        })
    ), {
        extraEffect: (response) => {
            //return;

            var { data } = response.data;

            //var nextValues = {
            //    ...undefineKeys([
            //        '$.experimentOperatorTeamId',
            //        '$.experimentOperatorIds',
            //        '$.labProcedureType',
            //        '$.locationId',
            //    ]),
            //    '$.subjectIds': [ undefined ]
            //}
            var nextValues = {};

            var labMethods = unique(data.records.map(it => it.type));
            var subjectTypes = unique(data.records.map(it => (
                it.state.subjectTypeKey
            )));

            if (hasOnlyOne(labMethods)) {
                nextValues['$.labProcedureType'] = labMethods[0];
            }

            if (hasOnlyOne(subjectTypes)) {
                nextValues['$.subjectType'] = subjectTypes[0];
            }
           
            if (hasOnlyOne(data.records)) {
                var [ settings ] = data.records;
                var { type, state } = settings;

                if (isInviteMethod(type)) {
                    var { locations } = settings.state;
                    if (locations.length === 1) {
                        var { locationId } = locations[0];
                        nextValues['$.locationId'] = locationId;
                    }
                }
            }

            setAllValues(formik, nextValues);
        },
        dependencies: [ studyId ]
    });

    if (!(didFetchSettings && didFetchSubjectTypes)) {
        return <LoadingIndicator size='lg' />
    }

    var subjectTypesByType = keyBy({
        items: fetchedSubjectTypes.data,
        byProp: 'type'
    });

    var { labProcedureType } = values['$'];
    
    var methodSubjectTypes = undefined;
    if (!labProcedureType) {
        return (
            <LabProcedureType
                types={ fetchedSettings.data.records.map(it => it.type) }
                settingsForType={ groupBy({
                    items: fetchedSettings.data.records,
                    byProp: 'type',
                })}
            />
        )
    }
    else {
        methodSubjectTypes = fetchedSettings.data.records.filter(it => (
            it.type === labProcedureType
        )).map(it => it.state.subjectTypeKey);
    }

    var labMethods = unique(fetchedSettings.data.records.map(it => it.type));

    var showLabMethodSelect = (
        !hasOnlyOne(labMethods)
    );
    var showSubjectTypeSelect = (
        !hasOnlyOne(methodSubjectTypes)
    );

    var {
        subjectType,
        subjectIds,
        labProcedureType,
    } = values['$'];

    return (
        <>
            { showLabMethodSelect && (
                <LabProcedureType
                    types={ fetchedSettings.data.records.map(it => it.type) }
                    settingsForType={ groupBy({
                        items: fetchedSettings.data.records,
                        byProp: 'type',
                    })}
                />
            )}
            { showSubjectTypeSelect && (
                <Fields.GenericEnum
                    label='Proband:innen-Typ'
                    dataXPath='$.subjectType'
                    options={
                        methodSubjectTypes
                        .reduce((acc, type) => ({
                            ...acc,
                            [type]: subjectTypesByType[type].label
                        }), {})
                    }
                />
            )}
            
            { subjectType && (
                <>
                    <Fields.ForeignIdList
                        label='Proband:innen'
                        dataXPath='$.subjectIds'
                        collection='subject'
                        recordType={ subjectType }
                    />
                    { subjectIds.length > 1 && (
                        <Fields.DefaultBool
                            label='Gruppentermin'
                            dataXPath='$.subjectsAreTestedTogether'
                        />
                    )}
                </>
            )}

            { subjectType && (
                <LabProcedureFields
                    studyId={ studyId }
                    fetchedSettings={ fetchedSettings }

                    subjectType={ subjectType }
                    subjectIds={ subjectIds }

                    enableTeamSelect={ enableTeamSelect }
                />
            )}
        </>
    );
}

const LabProcedureType = (ps) => {
    var { settingsForType, types, disabled } = ps;
    var formik = useFormikContext();
    var { setFieldValue } = formik;

    return (
        <Fields.GenericEnum
            label='Ablauf-Typ'
            dataXPath='$.labProcedureType'
            options={ types.reduce((acc, it) => ({
                ...acc, [it]: enums.labMethods.getLabel(it)
            }), {}) }
            extraOnChange={(nextMethod) => {
                var nextValues = {
                    ...undefineKeys([
                        '$.subjectType',
                        '$.experimentOperatorTeamId',
                        '$.experimentOperatorIds',
                        '$.locationId',
                    ]),
                    '$.subjectIds': [ undefined ]
                }
            
                var availableMethodSettings = settingsForType[nextMethod];
                if (hasOnlyOne(availableMethodSettings)) {
                    var settings = availableMethodSettings[0];
                    var { subjectTypeKey, locations } = settings.state;

                    nextValues['$.subjectType'] = subjectTypeKey;

                    if (isInviteMethod(nextMethod)) {
                        if (locations.length === 1) {
                            var { locationId } = locations[0];
                            nextValues['$.locationId'] = locationId;
                        }
                    }
                }

                setAllValues(formik, nextValues);
            }}
            disabled={ disabled }
        />
    )
}

// FIXME: unused but a neat idea
const Waterfall = (ps) => {
    var { conditions = [], children } = ps;

    var out = [];
    var isTrue = false;
    for (var [ it, ix ] of entries(children)) {
        if (ix + 1 > conditions.length) {
            out.push(it);
        }
        else {
            var isTrue = conditions[ix];
            if (isTrue) {
                out.push(it);
            }
            else {
                break;
            }
        }
    }

    return out;
}
