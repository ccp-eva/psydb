import React from 'react';
import { unique } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import * as Controls from '@mpieva/psydb-ui-form-controls';
import { withField } from '@mpieva/psydb-ui-lib';

const WKPRCWorkflowLocationTypeSelectControl = (ps) => {
    var {
        studyId,
        subjectType,

        dataXPath,
        formikField,
        formikForm,
        formikMeta,

        ...pass
    } = ps;
    // FIXME: thtas really dump withField sould have an option to pass
    // value/onChange diretcly in here
    var { setFieldValue } = formikForm;
    var { value } = formikField;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchExperimentVariantSettings({
            studyIds: [ studyId ], subjectTypes: [ subjectType ],
            types: [ 'apestudies-wkprc-default' ]
        })
    ), {
        dependencies: [ studyId, subjectType ],
        extraEffect: (response) => {
            var settings = response?.data?.data?.records;
            if (settings.length === 1) {
                var { locationTypeKeys } = settings[0].state;
                if (locationTypeKeys.length === 1) {
                    setFieldValue(dataXPath, locationTypeKeys[0]);
                }
            }
        }
    });

    if (!didFetch) {
        return null;
    }

    var { records, related } = fetched.data;
    var locationTypes = [];
    for (var r of records) {
        locationTypes.push(r.state.locationTypeKeys)
    }
    locationTypes = unique(locationTypes);

    if (locationTypes.length === 1) {
        //return null;
    }

    var options = {};
    for (var it of locationTypes) {
        options[it] = it; // FIXME
    }

    return (
        <Controls.GenericEnum
            { ...pass }
            value={ value }
            onChange={(next) => {
                setFieldValue(dataXPath, next);
            }}
            options={ options }
        />
    )
}

const WKPRCWorkflowLocationTypeSelect = withField({
    Control: WKPRCWorkflowLocationTypeSelectControl
})

export default WKPRCWorkflowLocationTypeSelect;
