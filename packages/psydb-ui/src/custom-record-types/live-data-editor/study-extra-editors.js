import React from 'react';
import { FormBox } from '@mpieva/psydb-ui-lib';
import { PanelPair } from './util';
import DisplayFieldEditor from './display-field-editor';

const StudyExtraEditors = (ps) => {
    return (
        <>
            <FormBox title='Beschreibungsfelder für Zusammenfassung'>
                <DisplayFieldEditor target='extra-description' { ...ps } />
            </FormBox>
        </>
    )
}

export default StudyExtraEditors;
