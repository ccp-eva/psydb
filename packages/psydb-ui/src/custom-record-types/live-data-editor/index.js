import React, { useState, useEffect } from 'react';

import { FormBox, LinkButton } from '@mpieva/psydb-ui-lib';

import GeneralEditor from './general-editor';
import DisplayFieldEditor from './display-field-editor';
import RecordLabelDefinitionEditor from './record-label-definition-editor';

const LiveDataEditor = ({ record, onSuccessfulUpdate }) => {
    var { collection, type, state } = record;
    var { label } = state;

    return (
        <div>
            <FormBox
                title='Allgemeine Einstellungen'
                extraClassName='mb-4'
            >
                <GeneralEditor
                    record={ record }
                    onSuccessfulUpdate={ onSuccessfulUpdate }
                />
            </FormBox>

            <FormBox
                title='Tabellenspalten (Allgemein)'
                extraClassName='mb-4'
            >
                <DisplayFieldEditor
                    target='table'
                    record={ record }
                    onSuccessfulUpdate={ onSuccessfulUpdate }
                />
            </FormBox>
            
            <FormBox
                title='Tabellenspalten (Options-Auswahl)'
                extraClassName='mb-4'
            >
                <DisplayFieldEditor
                    target='optionlist'
                    record={ record }
                    onSuccessfulUpdate={ onSuccessfulUpdate }
                />
            </FormBox>

            <FormBox
                title='Kurzanzeige bei Referenzierung'
                extraClassName='mb-4'
            >
                <RecordLabelDefinitionEditor
                    record={ record }
                    onSuccessfulUpdate={ onSuccessfulUpdate }
                />
            </FormBox>
        </div>
    );
}

export default LiveDataEditor;
