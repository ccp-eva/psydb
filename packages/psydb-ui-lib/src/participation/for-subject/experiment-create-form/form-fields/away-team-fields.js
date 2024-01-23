import React, { useState } from 'react';
import jsonpointer from 'jsonpointer';

import { unique, keyBy } from '@mpieva/psydb-core-utils';
import { useFetch, useFetchAll } from '@mpieva/psydb-ui-hooks';
import { Alert, Button } from '@mpieva/psydb-ui-layout';
import * as enums from '@mpieva/psydb-schema-enums';

import {
    DefaultForm,
    useFormikContext,
} from '../../../../formik';

import * as Fields from './fields';

export const AwayTeamFields = (ps) => {
    var {
        enableTeamSelect,
        studyId,
        subjectIds,
        subjectType,
        settings
    } = ps;

    var { subjectLocationFieldPointer } = settings.state;

    var formikForm = useFormikContext();
    var { setFieldValue } = formikForm;

    var [ fieldDef, setFieldDef ] = useState();

    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        crtSettings: agent.readCRTSettings({
            collection: 'subject', recordType: subjectType
        }),
        subjectData: agent.readManySubjects({
            ids: subjectIds.filter(it => it)
        })
    }), {
        dependencies: [ subjectType, subjectIds ],
        extraEffect: (responses) => {
            var crtSettings = responses.crtSettings.data.data;
            var { records, ...related } = responses.subjectData.data.data;

            var def = crtSettings.fieldDefinitions.scientific.find(it => (
                it.pointer === subjectLocationFieldPointer
            ));

            var locationIds = unique(records.map(it => (
                jsonpointer.get(it, def.pointer)
            )).filter(it => it));
            if (locationIds.length === 1) {
                setFieldValue('$.locationId', locationIds[0]);
            }
            else {
                setFieldValue('$.locationId', undefined)
            }

            setFieldDef(def);
        }
    });

    if (!didFetch || !fieldDef) {
        return null;
    }
    var { records, ...related } = fetched.subjectData.data;
   
    var locationIds = records.map(it => (
        jsonpointer.get(it, fieldDef.pointer)
    ));
    var emptyLocationIdsCount = locationIds.filter(it => !it).length
    var uniqueLocationIds = unique(
        locationIds.filter(it => it)
    );

    if (emptyLocationIdsCount) {
        return (
            <Alert variant='danger'>
                Eine oder mehrere Proband:innen haben das
                Feld "{fieldDef.displayName}" nicht gesetzt!
            </Alert>
        );
    }

    var locationOptions = (
        uniqueLocationIds.reduce((acc, id) => ({
            ...acc,
            [id]: related.relatedRecordLabels.location[id]._recordLabel
        }), {})
    );

    return (
        <>
            <Fields.Timestamp />
            <Fields.Status type='away-team' />
            { 
                enableTeamSelect
                ? <Fields.Team studyId={ studyId } />
                : <Fields.ExperimentOperators />
            }
            <Fields.GenericEnum
                label={ fieldDef.displayName }
                dataXPath='$.locationId'
                options={ locationOptions }
            />
        </>
    )
}

