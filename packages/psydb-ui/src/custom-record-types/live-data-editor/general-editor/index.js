import React from 'react';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { useSend, useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Button, WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

const reservationTypes = {
    'inhouse': 'Reservierbar (z.B. Instituts-Räume)',
    'away-team': 'Terminierbar (t.B. Kindergärten)',
    'no-reservation': 'Nein'
}

const GeneralEditor = (ps) => {
    var { record } = ps;
    var { collection, state: { label, reservationType }} = record;

    var modal = useModalReducer();
    return (
        <>
            <div>
                Anzeigename: { label }
            </div>
            { collection === 'subject'  && (
                <div>
                    { 
                        record.state.requiresTestingPermissions
                        ? 'Benötigt Test-Erlaubnis'
                        : 'Ohne Test-Erlaubnis'
                    }
                </div>
            )}
            { collection === 'location' && (
                <div>
                    Reservierung/Termine:
                    {' '}
                    { reservationTypes[reservationType] || 'inhouse' }
                </div>
            )}
            { collection === 'study'  && (
                <>
                    <div>
                        { 
                            record.state.enableSubjectSelectionSettings
                            ? 'Mit Auswahl-Bedingungen'
                            : 'Ohne Auswahl-Bedingungen'
                        }
                    </div>
                    <div>
                        { 
                            record.state.enableLabTeams
                            ? 'Mit Lab-Teams'
                            : 'Ohne Lab-Teams'
                        }
                    </div>
                </>
            )}
            <div className='mt-3'>
                <Button onClick={ modal.handleShow }>
                    Edit
                </Button>
            </div>
            <Modal
                { ...ps }
                { ...modal.passthrough }
            />
        </>
    )
}

const Modal = WithDefaultModal({
    title: 'Allgemeine Einstellungen',
    size: 'lg',
    Body: (ps) => {
        var { record, onHide, onSuccessfulUpdate } = ps;
        var {
            _id,
            _lastKnownEventId,
            collection,
            state: {
                label,
                reservationType = 'inhouse',
                requiresTestingPermissions = false,

                enableSubjectSelectionSettings = false,
                enableLabTeams = false,
            }
        } = record;

        var send = useSend((formData) => ({
            type: 'custom-record-types/set-general-data',
            payload: {
                id: _id,
                lastKnownEventId: _lastKnownEventId,
                ...formData
            }
        }), {
            onSuccessfulUpdate: demuxed([ onSuccessfulUpdate, onHide ])
        })

        var initialValues = {
            label,
            ...(collection === 'subject' && {
                requiresTestingPermissions
            }),
            ...(collection === 'location' && {
                reservationType
            }),
            ...(collection === 'study' && {
                enableSubjectSelectionSettings,
                enableLabTeams,
            }),
        };
        return (
            <Form
                collection={ collection }
                initialValues={ initialValues }
                onSubmit={ send.exec }
            />
        )
    }
});

const Form = (ps) => {
    var { collection, initialValues, onSubmit } = ps;
        
    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ onSubmit }
        >
            {(formikProps) => (
                <>
                    <Fields.SaneString
                        label='Anzeigename'
                        dataXPath='$.label'
                        required
                    />
                    { collection === 'subject' && (
                        <Fields.DefaultBool
                            label='Benötigt Test-Erlaubnis'
                            dataXPath='$.requiresTestingPermissions'
                        />
                    )}
                    { collection === 'location' && (
                        <Fields.GenericEnum
                            label='Reservierung/Termine'
                            dataXPath='$.reservationType'
                            options={ reservationTypes }
                            required
                        />
                    )}
                    { collection === 'study' && (
                        <>
                            <Fields.DefaultBool
                                label='Lab-Teams'
                                dataXPath='$.enableLabTeams'
                            />
                            <Fields.DefaultBool
                                label='Auswahl-Bedingungen'
                                dataXPath='$.enableSubjectSelectionSettings'
                            />
                        </>
                    )}
                    <Button type='submit'>Speichern</Button>
                </>
            )}
        </DefaultForm>
    )
}

export default GeneralEditor;
