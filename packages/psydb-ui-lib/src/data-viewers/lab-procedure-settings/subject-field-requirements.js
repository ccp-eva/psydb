import React from 'react';
import {
    subjectFieldRequirementChecks as checksEnum,
} from '@mpieva/psydb-schema-enums';

const SubjectFieldRequirements = (ps) => {
    var { value, subjectCRTSettings } = ps;
    var { fieldDefinitions } = subjectCRTSettings;
    
    var fieldLabels = (
        fieldDefinitions.scientific
        .reduce((acc, field) => {
            var { pointer, displayName } = field;
            return { ...acc, [pointer]: displayName };
        }, {})
    );

    return (
        !(Array.isArray(value) && value.length > 0)
        ? <i className='text-muted'>Keine</i>
        : (
            <div>
                { value.map((req, index) => {
                    var { pointer, check } = req;
                    return (
                        <span key={ index }>
                            { fieldLabels[pointer] }
                            {' - '}
                            { checksEnum.mapping[check] }
                        </span>
                    )
                }) }
            </div>
        )
    )
}

export default SubjectFieldRequirements;
