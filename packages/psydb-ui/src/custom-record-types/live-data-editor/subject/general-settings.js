import React from 'react';
import { Button } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';
import withGeneralSettingsEditor from '../with-general-settings-editor';

const Form = (ps) => {
    var { record, send } = ps;
    var { state: {
        label,
        requiresTestingPermissions = false,
        commentFieldIsSensitive = false,
        showSequenceNumber = true,
        showOnlineId = true,
    }} = record;

    var initialValues = {
        label,
        requiresTestingPermissions,
        commentFieldIsSensitive,
        showSequenceNumber,
        showOnlineId,
    };
        
    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ send.exec }
        >
            {(formikProps) => (
                <>
                    <Fields.SaneString
                        label='Anzeigename'
                        dataXPath='$.label'
                        required
                    />
                    <Fields.DefaultBool
                        label='Benötigt Test-Erlaubnis'
                        dataXPath='$.requiresTestingPermissions'
                    />
                    <Fields.DefaultBool
                        label='Kommentarfeld erfordert zusätzliche Berechtigung'
                        dataXPath='$.commentFieldIsSensitive'
                    />
                    
                    <Fields.DefaultBool
                        label='ID Nr. anzeigen'
                        dataXPath='$.showSequenceNumber'
                    />
                    <Fields.DefaultBool
                        label='Online-ID anzeigen'
                        dataXPath='$.showOnlineId'
                    />

                    <Button type='submit'>Speichern</Button>
                </>
            )}
        </DefaultForm>
    )
}

const View = (ps) => {
    var { record } = ps;
    var { state: {
        label,
        requiresTestingPermissions = false,
        commentFieldIsSensitive = false,
        showSequenceNumber = true,
        showOnlineId = true,
    }} = record;

    return (
        <>
            <div>
                Anzeigename: { label }
            </div>
            <div>
                { 
                    requiresTestingPermissions
                    ? 'Benötigt Test-Erlaubnis'
                    : 'Ohne Test-Erlaubnis'
                }
            </div>
            <div>
                { 
                    commentFieldIsSensitive
                    ? 'Kommentarfeld benötigt extra Berechtigung'
                    : 'Kommentarfeld ist für alle Sichtbar'
                }
            </div>
            <div>
                { 
                    showSequenceNumber
                    ? 'ID Nr. wird angezeigt'
                    : 'ID Nr. wird nicht angezeigt'
                }
            </div>
            <div>
                { 
                    showOnlineId
                    ? 'Online-ID wird angezeigt'
                    : 'Online-ID wird nicht angezeigt'
                }
            </div>
        </>
    )
}

const GeneralEditor = withGeneralSettingsEditor({
    title: 'Allgemeine Einstellungen',
    size: 'lg',

    View,
    Form,
})

export default GeneralEditor;
