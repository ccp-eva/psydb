import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { FormBox } from '@mpieva/psydb-ui-lib';
import { PanelPair } from './util';
import DisplayFieldEditor from './display-field-editor';

const StudyExtraEditors = (ps) => {
    var [{ translate }] = useI18N();
    return (
        <>
            <FormBox title={ translate('Extra Fields for Summary') }>
                <DisplayFieldEditor target='extra-description' { ...ps } />
            </FormBox>
        </>
    )
}

export default StudyExtraEditors;
