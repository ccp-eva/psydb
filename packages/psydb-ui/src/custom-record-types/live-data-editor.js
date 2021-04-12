import React, { useState, useEffect } from 'react';

import DisplayFieldEditor from './display-field-editor';

const LiveDataEditor = ({ record, onEdited }) => {

    return (
        <div>
            <div>
                Anzeigename: { record.state.label } 
            </div>
            <DisplayFieldEditor
                target='table'
                record={ record }
            />
        </div>
    );
}

export default LiveDataEditor;
