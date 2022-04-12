import React, { useState } from 'react';
import jsonpointer from 'jsonpointer';

import { keyBy } from '@mpieva/psydb-core-utils';
import { useFetch, useFetchAll } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import * as enums from '@mpieva/psydb-schema-enums';

import {
    DefaultForm,
    Fields,
} from '../../../formik';

export const AwayTeamFields = (ps) => {
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

