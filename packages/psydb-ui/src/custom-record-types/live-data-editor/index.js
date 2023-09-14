import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { FormBox, LinkButton } from '@mpieva/psydb-ui-lib';
import { PanelPair, PanelColumn } from './util';

import GeneralEditor from './general-editor';
import DisplayFieldEditor from './display-field-editor';
import RecordLabelDefinitionEditor from './record-label-definition-editor';
import FormOrderEditor from './form-order-editor';
import StudyExtraEditors from './study-extra-editors';
import DuplicateCheckFieldEditor from './duplicate-check-field-editor';

import SubjectTypeEditor from './subject';

const LiveDataEditor = (ps) => {
    var { record } = ps;
    var { collection, type, state } = record;
    var { label } = state;

    var translate = useUITranslation();

    if (collection === 'subject') {
        return (
            <SubjectTypeEditor { ...ps } />
        )
    }

    return (
        <div>
            <PanelPair>
                <PanelColumn>
                    <FormBox title={ translate('General Settings') }>
                        <GeneralEditor { ...ps }/>
                    </FormBox>

                    <FormBox title={ translate('Short Label when Referencing') }>
                        <RecordLabelDefinitionEditor { ...ps } />
                    </FormBox>
                    
                    { /*collection === 'subject' && ( 
                        <FormBox title={ translate('Field Order in Forms') }>
                            <FormOrderEditor { ...ps } />
                        </FormBox>
                    )*/}

                    { collection === 'study' && (
                        <StudyExtraEditors { ...ps } />
                    )}

                </PanelColumn>
                <PanelColumn>
                    <FormBox title={ translate('Columns (General)') }>
                        <DisplayFieldEditor target='table' { ...ps } />
                    </FormBox>
                    
                    <FormBox title={ translate('Columns (Option Select)') }>
                        <DisplayFieldEditor target='optionlist' { ...ps } />
                    </FormBox>
                </PanelColumn>
            </PanelPair>

        </div>
    );
}

export default LiveDataEditor;
