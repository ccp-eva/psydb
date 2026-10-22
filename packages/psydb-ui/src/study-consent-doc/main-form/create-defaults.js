import { jsonpointer } from '@mpieva/psydb-core-utils';

export const createDefaults = (options) => {
    var { subject, relatedRecordLabels, studyConsentForm, subjectCRT }
        = options;

    if (!subject || !studyConsentForm) {
        return {};
    }

    var out = { elementValues: {} };
    for (var [ ix, it ] of studyConsentForm.state.elements.entries()) {
        var { type, pointer } = it;
        if (type === 'subject-field') {
            var value = jsonpointer.get(subject, pointer);
            var definition = subjectCRT?.findOneCustomField({ pointer });
            if (definition?.systemType === 'ForeignId') {
                var { collection } = definition.props;
                value = (
                    value
                    ? relatedRecordLabels?.[collection]?.[value]?._recordLabel
                    : undefined
                ) || '';
            }
            out.elementValues[ix] = value;
        }
    }
    return out;
}
