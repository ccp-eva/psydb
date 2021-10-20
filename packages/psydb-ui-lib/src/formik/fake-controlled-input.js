const fakeControlledInput = (formikField, fallback) => {
    let { value } = formikField;
    return {
        ...formikField,
        value: (
            value === undefined || value === null
            ? fallback
            : value
        )
    }
}

export default fakeControlledInput;
