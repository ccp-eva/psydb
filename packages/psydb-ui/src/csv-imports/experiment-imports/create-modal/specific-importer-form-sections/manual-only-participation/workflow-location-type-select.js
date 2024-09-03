import React from 'react';
import { unique } from '@mpieva/psydb-core-utils';
import { maybeGetValueWhenUnspread } from'@mpieva/psydb-common-lib';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import * as Controls from '@mpieva/psydb-ui-form-controls';
import { withField, useFormikTheme } from '@mpieva/psydb-ui-lib';

// onChangeReceivesEvents: false
const WorkflowLocationTypeSelectControl = (ps) => {
    var {
        studyId,
        subjectType,
        saneFormikField,
        ...pass
    } = ps;

    var { value, onChange } = saneFormikField;

    var theme = useFormikTheme();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchExperimentVariantSettings({
            studyIds: [ studyId ], subjectTypes: [ subjectType ],
            types: [ 'manual-only-participation' ]
        })
    ), {
        dependencies: [ studyId, subjectType ],
        extraEffect: (response) => {
            var settings = response?.data?.data?.records;
            var { hasSpread, value } = maybeGetValueWhenUnspread(
                settings || [], '/0/state/locationTypeKeys/0'
            );
            if (!hasSpread) {
                onChange(value);
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
        return null;
    }

    var options = {};
    for (var it of locationTypes) {
        options[it] = it; // FIXME
    }

    var Wrapper = theme.getWrapperForFieldControl({
        DefaultWrapper: 'FieldWrapper',
    }, ps);

    // FIXME: control should get passed more props
    return (
        <Wrapper { ...ps }>
            <Controls.GenericEnum
                { ...saneFormikField }
                options={ options }
            />
        </Wrapper>
    )
}

const WorkflowLocationTypeSelect = withField({
    Control: WorkflowLocationTypeSelectControl,
    isThemed: false,
    onChangeReceivesEvents: false,
})

export default WorkflowLocationTypeSelect;
