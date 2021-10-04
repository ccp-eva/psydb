import React, { useState, useMemo } from 'react';
import { ROSchemaForm } from '@mpieva/psydb-ui-schema-form';

import {
    ExactObject,
    DefaultBool,
    Integer
} from '@mpieva/psydb-schema-fields';

import {
    ExternalLocationGrouping,
} from '@mpieva/psydb-schema-fields-special';

import { EditIconButton } from '@mpieva/psydb-ui-layout';
import GeneralSubjectTypeSettingsModal from './general-subject-type-settings-modal';

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
        }),
        subjectsPerExperiment: Integer({
            title: 'Probanden pro Experiment',
            default: 1,
            minimum: 1,
        })
    },
    required: [
        'enableOnlineTesting',
        'externalLocationGrouping',
        'subjectsPerExperiment'
    ]
})

const GeneralSubjectTypeSettings = ({
    externalLocationGrouping,
    enableOnlineTesting,
    subjectsPerExperiment,

    subjectRecordType,
    studyRecord,
    subjectTypeData,
    
    onSuccessfulUpdate,
}) => {
    
    var [ showModal, setShowModal ] = useState(false);
    var [
        handleShowModal,
        handleHideModal
    ] = useMemo(() => ([
        () => setShowModal(true),
        () => setShowModal(false),
    ]), []);

    var schema = useMemo(
        () => createSchema({ subjectTypeData }),
        [ subjectTypeData ]
    );

    return (
        <div className='mb-3'>
            <header><b>Generelle Typ-Einstellungen</b></header>
            <div className='pt-3 pl-3 pr-3 bg-white border position-relative'>
                <ROSchemaForm
                    schema={ schema }
                    formData={{
                        externalLocationGrouping,
                        enableOnlineTesting,
                        subjectsPerExperiment,
                    }}
                />
                <div style={{ position: 'absolute', top: '-1px', right: '-1px'}}>
                    <EditIconButton
                        onClick={ handleShowModal }
                    />
                    <GeneralSubjectTypeSettingsModal { ...({
                        show: showModal,
                        onHide: handleHideModal,

                        schema,
                        externalLocationGrouping,
                        enableOnlineTesting,
                        subjectsPerExperiment,

                        subjectRecordType,
                        studyRecord,
                        
                        onSuccessfulUpdate,
                    }) } />
                </div>
            </div>
        </div>
    );
}

export default GeneralSubjectTypeSettings;
