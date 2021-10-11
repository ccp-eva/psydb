import React, { useState } from 'react';
import { Formik } from 'formik';

import { Button, Form, InputGroup } from 'react-bootstrap';

const FieldPointerSelector = ({
    onSelect,
    selectedDataPointers,
    availableFieldDataByPointer,
}) => {

    var selectable = (
        Object.values(availableFieldDataByPointer)
        .filter(it => !selectedDataPointers.includes(it.dataPointer))
        .filter(it => {
            return it.type !== 'ListOfObjects'
        })
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
                <Form as='fieldset' className='form-group'>
                        <InputGroup> 
                            <Form.Control
                                as='select'
                                name='dataPointer'
                                onChange={ handleChange }
                            >
                                { /*!values.dataPointer && (
                                    <option>Please Select</option>
                                ) FIXME: cant update the state here */}
                                <option>Please Select</option>
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
                                <Button onClick={ handleSubmit }>
                                    Hinufügen
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                </Form>
            )}
        </Formik>
    )
};

export default FieldPointerSelector;
