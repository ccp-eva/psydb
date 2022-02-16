import React from 'react';
import { FormBox } from '@mpieva/psydb-ui-lib';
import PanelPair from './panel-pair';
import DisplayFieldEditor from './display-field-editor';

const StudyExtraEditors = (ps) => {
    return (
        <>
            <FormBox title='Felder in Zusammenfassung'>
                <DisplayFieldEditor target='extra-description' { ...ps } />
            </FormBox>
        </>
    )
}

export default StudyExtraEditors;
