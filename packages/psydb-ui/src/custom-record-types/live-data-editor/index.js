import React, { useState, useEffect } from 'react';

import { LinkButton } from '@mpieva/psydb-ui-lib';

import DisplayFieldEditor from './display-field-editor';
import RecordLabelDefinitionEditor from './record-label-definition-editor';


const LiveDataEditor = ({ record, onSuccessfulUpdate }) => {

    return (
        <div>
            <div>
                Anzeigename: { record.state.label } 
            </div>

            <hr />
            
            <h3>Anzeigefelder Tabellen</h3>
            <DisplayFieldEditor
                target='table'
                record={ record }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
            
            <hr />

            <h3>Anzeigefelder Options-Listen</h3>
            <DisplayFieldEditor
                target='optionlist'
                record={ record }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />

            <hr />

            <h3>Kurzanzeige bei Referenzierung</h3>
            <RecordLabelDefinitionEditor
                record={ record }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
        </div>
    );
}

export default LiveDataEditor;
