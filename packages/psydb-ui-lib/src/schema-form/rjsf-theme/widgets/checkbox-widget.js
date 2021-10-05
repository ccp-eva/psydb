import React, { useCallback, useState } from "react";
import { Form } from "react-bootstrap";
import * as wrappers from '../utility-components/wrappers';

const CheckboxWidget = (ps) => {

    const {
        id,
        value,
        required,
        label,
        schema,
        parentSchema,
        onChange,
        rawErrors = [],
    } = ps;

    var {
        systemType,
        systemProps = {}
    } = schema;

    var Variant = variants[systemType];
    if (!Variant) {
        Variant = variants.SelectVariant;
    }

    var Wrapper = wrappers[systemProps.uiWrapper];
    if (!Wrapper) {
        Wrapper = wrappers.InlineWrapper;
    }

    // FIXME: this is is really hacky
    if (parentSchema.systemType === 'WeekdayBoolObject') {
        Wrapper = ({ children }) => ( <div>{ children }</div> );
        Variant = variants.RealCheckboxVariant;
    }

    return (
        <Wrapper { ...({
            id, required, schema, rawErrors, label,
            valueClassName: 'd-flex align-items-center'
        }) }>
            <Variant { ...ps } />
        </Wrapper>
    );
};

const RealCheckboxVariant = (ps) => {
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

const SelectVariant = (ps) => {
    const {
        id,
        value,
        required,
        label,
        schema,
        onChange,
        rawErrors = [],
    } = ps;

    const _onChange = useCallback((event) => {
        var { target: { value }} = event;
        onChange(value === 'true');
    });

    const desc = label || schema.description;
    return (
        <Form.Control
            as='select'
            id={id}
            value={String(value)}
            required={required}
            className={rawErrors.length > 0 ? "is-invalid" : ""}
            onChange={_onChange}
        >
            { (value !== true && value !== false) && (
                <option>Bitte wählen...</option>
            )}
            <option value='false'>Nein</option>
            <option value='true'>Ja</option>
        </Form.Control>
    );

}

const variants = {
    SelectVariant,
    RealCheckboxVariant,
}

export default CheckboxWidget;
