import React, { useState } from 'react';
import jsonpointer from 'jsonpointer';

import { keyBy } from '@mpieva/psydb-core-utils';
import { useFetch, useFetchAll } from '@mpieva/psydb-ui-hooks';
import { Alert, Button } from '@mpieva/psydb-ui-layout';
import * as enums from '@mpieva/psydb-schema-enums';

import {
    DefaultForm,
    useFormikContext,
} from '../../../formik';

import * as Fields from './fields';

export const AwayTeamFields = (ps) => {
    var { enableTeamSelect, studyId, subjectId, subjectType, settings } = ps;

    var { subjectLocationFieldPointer } = settings.state;

    var formikForm = useFormikContext();
    var { setFieldValue } = formikForm;

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

            setFieldValue('$.locationId', locationId);
            setFieldDef(def);
        }
    });

    if (!didFetch || !fieldDef) {
        return null;
    }
    var { record, ...related } = fetched.subjectData.data;
    var locationId = jsonpointer.get(record, fieldDef.pointer);

    if (!locationId) {
        return (
            <Alert variant='danger'>
                Proband:in hat Feld "{fieldDef.displayName}"
                nicht gesetzt!
            </Alert>
        );
    }

    var locationLabel = (
        locationId
        ? related.relatedRecordLabels.location[locationId]._recordLabel
        : ''
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
            <Fields.AwayLocation
                label={ fieldDef.displayName }
                dataXPath='$.locationId'
                locationId={ locationId }
                locationLabel={ locationLabel }
            />
        </>
    )
}

