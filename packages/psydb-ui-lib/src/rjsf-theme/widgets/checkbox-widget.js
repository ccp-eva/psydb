import React, { useCallback } from "react";
import { Form } from "react-bootstrap";
import * as wrappers from '../utility-components/wrappers';

const CheckboxWidget = (ps) => {

    const {
        id,
        value,
        required,
        label,
        schema,
        onChange,
        rawErrors = [],
    } = ps;

    var {
        systemType,
        systemProps = {}
    } = schema;

    var Variant = variants[systemType];
    if (!Variant) {
        Variant = variants.DefaultVariant;
    }

    var Wrapper = wrappers[systemProps.uiWrapper];
    if (!Wrapper) {
        Wrapper = wrappers.InlineWrapper;
    }
    
    return (
        <Wrapper { ...({
            id, required, schema, rawErrors,
            valueClassName: 'd-flex align-items-center'
        }) }>
            <Variant { ...ps } />
        </Wrapper>
    );
};

const DefaultVariant = (ps) => {
    const {
        id,
        value,
        required,
        label,
        schema,
        onChange,
    } = ps;
    
    const _onChange = useCallback((event) => {
        var { target: { checked }} = event;
        onChange(checked)
    })

    const desc = label || schema.description;
    return (
        <Form.Check
            id={id}
            label={desc}
            checked={typeof value === "undefined" ? false : value}
            required={required}
            onChange={_onChange}
            type="checkbox"
        />
    );
}

const variants = {
    DefaultVariant,
}

export default CheckboxWidget;
