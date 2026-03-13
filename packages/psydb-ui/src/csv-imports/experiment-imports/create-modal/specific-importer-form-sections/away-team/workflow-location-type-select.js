import React from 'react';
import { unique } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetchAll } from '@mpieva/psydb-ui-hooks';
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

    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        subjectCRT: agent.readCRTSettings({
            collection: 'subject', recordType: subjectType, wrap: true
        }),
        evSettings: agent.fetchExperimentVariantSettings({
            studyIds: [ studyId ], subjectTypes: [ subjectType ],
            types: [ 'away-team' ]
        }),
    }), [ studyId, subjectType ]);

    if (!didFetch) {
        return null;
    }

    var subjectCRT = fetched.subjectCRT.data;
    var { records, related } = fetched.evSettings.data;

    var locationTypes = [];
    for (var it of records) {
        var { subjectLocationFieldPointer } = it.state;
        var def = subjectCRT.findOneCustomField({
            pointer: subjectLocationFieldPointer
        });
        if (def) {
            locationTypes.push(def.props.recordType)
        }
    }
    locationTypes = unique(locationTypes);

    //if (locationTypes.length === 1) {
    //    return null;
    //}

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
