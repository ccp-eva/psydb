import { jsonpointer } from '@mpieva/psydb-core-utils';
export const createDefaults = (options) => {
    var {
        preselectedSubject,
        labMethodSettings,
    } = options;

    var out = {
        subjectsAreTestedTogether: true,
        subjectData: [{
            ...(preselectedSubject && {
                subjectId: preselectedSubject._id,
            }),
            status: 'participated',
            excludeFromMoreExperimentsInStudy: false,
        }],
    }

    if (preselectedSubject) {
        var settings = labMethodSettings.find(it => (
            it.state.subjectTypeKey === preselectedSubject.type
        ));
        if (settings) {
            var { subjectLocationFieldPointer } = settings.state;
            out.locationId = jsonpointer.get(
                preselectedSubject, subjectLocationFieldPointer
            );
        }
    }

    return out;
}
