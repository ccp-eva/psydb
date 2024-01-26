import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import * as Fields from '../../form-fields';

const PreselectedSubjectFields = (ps) => {
    var { subjectType, enableFollowUpExperiments } = ps;
    var translate = useUITranslation();

    return (
        <>
            <Fields.ForeignId
                label={ translate('Subject') }
                dataXPath='$.subjectData.0.subjectId'
                collection='subject'
                recordType={ subjectType }
                readOnly={ true }
            />
            <Fields.Timestamp
                dataXPath={`$.timestamp`}
            />
            <Fields.Status type='online-survey'
                dataXPath='$.subjectData.0.status'
            />
            { enableFollowUpExperiments && (
                <Fields.DefaultBool
                    label={ translate('Last Survey?') }
                    dataXPath={
                        '$.subjectData.0.excludeFromMoreExperimentsInStudy'
                    }
                />
            )}
        </>
    );
}

export default PreselectedSubjectFields;
