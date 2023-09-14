import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { FormBox } from '@mpieva/psydb-ui-lib';
import { PanelPair, PanelColumn } from '../util';
import {
    DisplayFieldEditor,
    RecordLabelDefinitionEditor,
    FormOrderEditor,
    DuplicateCheckFieldEditor,
} from '../common-editors';

import GeneralSettings from './general-settings';

const SubjectContainer = (ps) => {
    var translate = useUITranslation();
    return (
        <PanelPair>
            <PanelColumn>
                <FormBox title={ translate('General Settings') }>
                    <GeneralSettings { ...ps } />
                </FormBox>
                <FormBox title={ translate('Short Label when Referencing') }>
                    <RecordLabelDefinitionEditor { ...ps } />
                </FormBox>
                <FormBox title={ translate('Field Order in Forms') }>
                    <FormOrderEditor { ...ps } />
                </FormBox>
            </PanelColumn>
            <PanelColumn>
                <FormBox title={ translate('Columns (General)') }>
                    <DisplayFieldEditor target='table' { ...ps } />
                </FormBox>
                
                <FormBox title={ translate('Columns (Option Select)') }>
                    <DisplayFieldEditor target='optionlist' { ...ps } />
                </FormBox>
                
                <FormBox title={ translate('Extra Columns for Subject Selection (Inhouse/Video)') }>
                    <DisplayFieldEditor
                        target='invite-selection-list'
                        { ...ps }
                    />
                </FormBox>
                <FormBox title={ translate('Extra Columns for Subject Selection (External)') }>
                    <DisplayFieldEditor
                        target='away-team-selection-list'
                        { ...ps }
                    />
                </FormBox>
                <FormBox title={ translate('Fields for Duplication Check')}>
                    <DuplicateCheckFieldEditor { ...ps } />
                </FormBox>
            </PanelColumn>
        </PanelPair>
    )
}

export default SubjectContainer;
