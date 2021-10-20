const fixSelectProps = ({
    dataXPath,
    options,
    formikField,
    formikForm,
}) => {
    let { value } = formikField;
    let { setFieldValue } = formikForm;

    return {
        ...formikField,
        value: options.findIndex(it => it === value),
        onChange: (event) => {
            let { target: { value }} = event;
            setFieldValue(dataXPath, options[value]);
        }
    }
}

export default fixSelectProps;
