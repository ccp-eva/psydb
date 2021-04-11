import React, { useState, useEffect } from 'react';
import { Formik, connect } from 'formik';

const CreateNewType = () => {
    var handleSubmit = (values, { setSubmitting }) => {
        alert('foo');
        console.log(values);
        alert('foo');
        setSubmitting(false)
    }

    return (
        <Formik onSubmit={ handleSubmit } initialValues={{}}>
            { (ps) => (
                <FormBody { ...ps } />
            )}
        </Formik>
    );
}

const FormBody = ({
    values,
    handleSubmit,
    handleChange
}) => {
    return (
        <form onSubmit={ handleSubmit }>
            <select
                name='collection'
                onChange={ handleChange }
            >
                <option>Please Select</option>
                <option value='subject'>Subject</option>
            </select>
            <input
                type='text'
            />
            <button type='submit'>Submit</button>
        </form>
    );
}

export default CreateNewType;
