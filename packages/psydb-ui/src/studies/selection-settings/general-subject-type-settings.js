import React from 'react';
import ROSchemaForm from '@mpieva/psydb-ui-lib/src/ro-schema-form';

import {
    ExactObject,
    DefaultBool
} from '@mpieva/psydb-schema-fields';

import {
    ExternalLocationGrouping,
} from '@mpieva/psydb-schema-fields-special';

import EditIconButton from '@mpieva/psydb-ui-lib/src/edit-icon-button';

const createSchema = ({ subjectTypeData }) => ExactObject({
    properties: {
        enableOnlineTesting: DefaultBool({
            title: 'Online-Tests',
        }),
        externalLocationGrouping: ExternalLocationGrouping({
            subjectRecordType: subjectTypeData.type,
            subjectRecordTypeScientificFields: (
                subjectTypeData.state.settings.subChannelFields.scientific
            )
        })
    },
    required: [
        'enableOnlineTesting',
        'externalLocationGrouping'
    ]
})

const GeneralSubjectTypeSettings = ({
    externalLocationGrouping,
    enableOnlineTesting,

    subjectRecordType,
    studyRecord,
    subjectTypeData,
}) => {
    console.log(subjectTypeData);
    
    var schema = createSchema({ subjectTypeData });

    return (
        <div className='mb-3'>
            <header><b>Generelle Einstellungen</b></header>
            <div className='pt-3 pl-3 pr-3 bg-white border position-relative'>
                <ROSchemaForm
                    schema={ schema }
                    formData={{
                        externalLocationGrouping,
                        enableOnlineTesting
                    }}
                />
                <div style={{ position: 'absolute', top: '-1px', right: '-1px'}}>
                    <EditIconButton />
                </div>
            </div>
        </div>
    );
}

export default GeneralSubjectTypeSettings;
