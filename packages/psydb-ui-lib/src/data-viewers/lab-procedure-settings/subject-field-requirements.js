import React from 'react';
import enums from '@mpieva/psydb-schema-enums';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';


const SubjectFieldRequirements = (ps) => {
    var { value, subjectCRTSettings } = ps;
    var { fieldDefinitions } = subjectCRTSettings;
    
    var translate = useUITranslation();

    var fieldLabels = (
        fieldDefinitions.scientific
        .reduce((acc, field) => {
            var { pointer, displayName } = field;
            return { ...acc, [pointer]: displayName };
        }, {})
    );

    return (
        !(Array.isArray(value) && value.length > 0)
        ? <i className='text-muted'>{ translate('None') }</i>
        : (
            <div>
                { value.map((req, index) => {
                    var { pointer, check } = req;
                    return (
                        <span key={ index }>
                            { fieldLabels[pointer] }
                            {' - '}
                            { enums.subjectFieldRequirementChecks.mapping[check] }
                        </span>
                    )
                }) }
            </div>
        )
    )
}

export default SubjectFieldRequirements;
