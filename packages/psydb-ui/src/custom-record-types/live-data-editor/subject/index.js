import React from 'react';

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
    return (
        <PanelPair>
            <PanelColumn>
                <FormBox title='Allgemeine Einstellungen'>
                    <GeneralSettings { ...ps } />
                </FormBox>
                <FormBox title='Kurzanzeige bei Referenzierung'>
                    <RecordLabelDefinitionEditor { ...ps } />
                </FormBox>
                <FormBox title='Feldsortierung im Formular'>
                    <FormOrderEditor { ...ps } />
                </FormBox>
            </PanelColumn>
            <PanelColumn>
                <FormBox title='Tabellenspalten (Allgemein)'>
                    <DisplayFieldEditor target='table' { ...ps } />
                </FormBox>
                
                <FormBox title='Tabellenspalten (Options-Auswahl)'>
                    <DisplayFieldEditor target='optionlist' { ...ps } />
                </FormBox>
                
                <FormBox title='Extra Spalten bei Einladung (Inhouse, Online-Video-Anruf)'>
                    <DisplayFieldEditor
                        target='invite-selection-list'
                        { ...ps }
                    />
                </FormBox>
                <FormBox title='Extra Spalten bei Auswahl (Extern)'>
                    <DisplayFieldEditor
                        target='away-team-selection-list'
                        { ...ps }
                    />
                </FormBox>
                <FormBox title='Felder für Duplikatsprüfung'>
                    <DuplicateCheckFieldEditor { ...ps } />
                </FormBox>
            </PanelColumn>
        </PanelPair>
    )
}

export default SubjectContainer;
