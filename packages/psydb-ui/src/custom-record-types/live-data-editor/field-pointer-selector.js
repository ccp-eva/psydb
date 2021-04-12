import React, { useState } from 'react';
import { Formik } from 'formik';

import { Button, Form, InputGroup } from 'react-bootstrap';

const FieldPointerSelector = ({
    onSelect,
    selectedDataPointers,
    availableDisplayFieldDataByDataPointer,
}) => {

    var selectable = (
        Object.values(availableDisplayFieldDataByDataPointer)
        .filter(it => !selectedDataPointers.includes(it.dataPointer))
        .map(it => ({
            dataPointer: it.dataPointer,
            displayName: it.displayName
        }))
    )

    var handleSubmit = (values, { setSubmitting }) => {
        if (values.dataPointer) {
            onSelect(values.dataPointer);
        }
        setSubmitting(false)
    };

    return (
        <Formik onSubmit={ handleSubmit } initialValues={{}}>
            { ({ values, handleSubmit, handleChange }) => (
                <Form onSubmit={ handleSubmit }>
                    <InputGroup> 
                        <Form.Control
                            as='select'
                            name='dataPointer'
                            onChange={ handleChange }
                        >
                            { /*!values.dataPointer && (
                                <option>Please Select</option>
                            ) FIXME: cant update the state here */}
                            { selectable.map(it => (
                                <option
                                    key={it.dataPointer}
                                    value={ it.dataPointer }
                                >
                                    { it.displayName }
                                </option>
                            ))}
                        </Form.Control>
                        <InputGroup.Append>
                            <Button type='submit'>Hinufügen</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
            )}
        </Formik>
    )
};

export default FieldPointerSelector;
