import React, { useState, useEffect } from 'react';

import { arrify } from '@mpieva/psydb-core-utils';
import { FormBox, LinkButton } from '@mpieva/psydb-ui-lib';

import PanelPair from './panel-pair';
import GeneralEditor from './general-editor';
import DisplayFieldEditor from './display-field-editor';
import RecordLabelDefinitionEditor from './record-label-definition-editor';
import FormOrderEditor from './form-order-editor';
import StudyExtraEditors from './study-extra-editors';
import DuplicateCheckFieldEditor from './duplicate-check-field-editor';

const PanelColumn = (ps) => {
    var { children } = ps;
    children = arrify(children);
    
    return (
        <>
            { children.map((it, ix) => (
                <div key={ ix } className='mb-4'>{ it }</div>
            ))}
        </>
    )
}

const LiveDataEditor = (ps) => {
    var { record } = ps;
    var { collection, type, state } = record;
    var { label } = state;

    return (
        <div>
            <PanelPair>
                <PanelColumn>
                    <FormBox title='Allgemeine Einstellungen'>
                        <GeneralEditor { ...ps }/>
                    </FormBox>

                    <FormBox title='Kurzanzeige bei Referenzierung'>
                        <RecordLabelDefinitionEditor { ...ps } />
                    </FormBox>
                    
                    { collection === 'subject' && ( 
                        <FormBox title='Feldsortierung im Formular'>
                            <FormOrderEditor { ...ps } />
                        </FormBox>
                    )}

                    { collection === 'study' && (
                        <StudyExtraEditors { ...ps } />
                    )}

                </PanelColumn>
                <PanelColumn>
                    <FormBox title='Tabellenspalten (Allgemein)'>
                        <DisplayFieldEditor target='table' { ...ps } />
                    </FormBox>
                    
                    <FormBox title='Tabellenspalten (Options-Auswahl)'>
                        <DisplayFieldEditor target='optionlist' { ...ps } />
                    </FormBox>
                    
                    { collection === 'subject' && (
                        <FormBox title='Extra Spalten bei Einladung (Inhouse, Online-Video-Anruf)'>
                            <DisplayFieldEditor target='invite-selection-list' { ...ps } />
                        </FormBox>
                    )}
                    { collection === 'subject' && (
                        <FormBox title='Extra Spalten bei Auswahl (Extern)'>
                            <DisplayFieldEditor target='away-team-selection-list' { ...ps } />
                        </FormBox>
                    )}
                    { collection === 'subject' && (
                        <FormBox title='Felder für Duplikatsprüfung'>
                            <DuplicateCheckFieldEditor { ...ps } />
                        </FormBox>
                    )}
                </PanelColumn>
            </PanelPair>

        </div>
    );
}

export default LiveDataEditor;
