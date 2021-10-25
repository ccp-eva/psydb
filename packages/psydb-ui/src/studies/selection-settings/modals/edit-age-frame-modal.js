import React from 'react';

import {
    ExactObject,
    ExperimentSelectorEnum
} from '@mpieva/psydb-schema-fields';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { SchemaForm } from '@mpieva/psydb-ui-lib';

const EditAgeFrameModalBody = (ps) => {
    var {
        studyId,
        allowedSubjectTypes,
        modalPayloadData,

        onHide,
        onSuccessfulUpdate,
    } = ps;

    var { selectorRecord, ageFrameRecord } = modalPayloadData;
    var { _id: selectorId, type: selectorType } = selectorRecord;

    return (
        <div>Foo
        {/*<AgeFrameForm {...({
            op: 'patch',
            studyId,
            selectorId,
            ageFrameRecord,
            allowedSubjectTypes,
            onSuccessfulUpdate: demuxed([ onHide, onSuccessfulUpdate ])
        })} />*/}
        </div>
    );
}

const EditAgeFrameModal = WithDefaultModal({
    title: 'Altersfenster hinzufügen',
    size: 'lg',

    Body: EditAgeFrameModalBody
});

export default EditAgeFrameModal;
