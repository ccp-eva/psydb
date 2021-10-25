import React from 'react';

import {
    ExactObject,
    ExperimentVariantEnum
} from '@mpieva/psydb-schema-fields';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { AgeFrameForm } from '../age-frame-form';

const NewAgeFrameModalBody = (ps) => {
    var {
        studyId,
        modalPayloadData,

        onHide,
        onSuccessfulUpdate,
    } = ps;

    var { selectorRecord } = modalPayloadData;
    var { _id: selectorId, subjectTypeKey } = selectorRecord;

    return (
        <AgeFrameForm {...({
            op: 'create',
            studyId,
            selectorId,
            subjectTypeKey,
            onSuccessfulUpdate: demuxed([ onHide, onSuccessfulUpdate ])
        })} />
    );
}

const NewAgeFrameModal = WithDefaultModal({
    title: 'Altersfenster hinzufügen',
    size: 'lg',

    Body: NewAgeFrameModalBody
});

export default NewAgeFrameModal;
