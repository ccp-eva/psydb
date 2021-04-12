import React, { useState, useEffect } from 'react';

import { Modal, Button } from 'react-bootstrap';

const NewFieldModal = ({ show, onHide, record }) => {
    return (
        <Modal show={show} onHide={ onHide }>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <NewFieldForm />
            </Modal.Body>
        </Modal>
    );
}

import FieldDefinitionSchemas from '@mpieva/psydb-common-lib/src/field-definition-schemas';

var schema = {
    type: 'object',
    oneOf: Object.values(FieldDefinitionSchemas).map(f => f())
};

console.log(schema);


import { withTheme } from '@rjsf/core';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4'

var SchemaForm = withTheme(Bootstrap4Theme);

const NewFieldForm = () => {
    var onSubmit = () => {};
    return (
        <div>
            <SchemaForm
                schema={ schema }
                onSubmit={ onSubmit }
            >
                <div>
                    <button type="submit" className="btn btn-info">
                        Save
                    </button>
                </div>
            </SchemaForm>
        </div>
    )

}

export default NewFieldModal;
