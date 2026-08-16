import { jsonpointer } from '@mpieva/psydb-core-utils';

export const createDefaults = (options) => {
    var { subject, studyConsentForm } = options;

    if (!subject || !studyConsentForm) {
        return {};
    }

    var out = { elementValues: {} };
    for (var [ ix, it ] of studyConsentForm.state.elements.entries()) {
        var { type, pointer } = it;
        if (type === 'subject-field') {
            out.elementValues[ix] = jsonpointer.get(subject, pointer)
        }
    }
    return out;
}
