import React, { useCallback } from 'react';

import { Form } from 'react-bootstrap';
import { utils } from "@rjsf/core";
import { InlineWrapper } from '../utility-components';

const { asNumber, guessType } = utils;

const nums = new Set(["number", "integer"]);


/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
const processValue = (schema, value) => {
    // "enum" is a reserved word, so only "type" and "items" can be destructured
    const { type, items } = schema;
    if (value === "") {
        return undefined;
    }
    else if (type === "array" && items && nums.has(items.type)) {
        return value.map(asNumber);
    }
    else if (type === "boolean") {
        return value === "true";
    }
    else if (type === "number") {
        return asNumber(value);
    }

    // If type is undefined, but an enum is present, try and infer the type from
    // the enum values
    if (schema.enum) {
        if (schema.enum.every(x => guessType(x) === "number")) {
            return asNumber(value);
        }
        else if (schema.enum.every(x => guessType(x) === "boolean")) {
            return value === "true";
        }
    }

    return value;
};

const SelectWidget = ({
    schema,
    id,
    options,
    label,
    required,
    value,
    multiple,
    autofocus,
    onChange,
    placeholder,
    rawErrors = [],
}) => {
    const { enumOptions, enumDisabled } = options;

    const emptyValue = multiple ? [] : "";

    var getValue = useCallback((event, multiple) =>  {
        if (multiple) {
            return [].slice
                .call(event.target.options)
                .filter((o) => o.selected)
                .map((o) => o.value);
        }
        else {
            return event.target.value;
        }
    }, [])

    return (
        <InlineWrapper { ...({
            id, label, required, schema, rawErrors
        }) }>
            <Form.Control
                as="select"
                custom
                id={id}
                value={typeof value === "undefined" ? emptyValue : value}
                required={required}
                multiple={multiple}
                className={rawErrors.length > 0 ? "is-invalid" : ""}
                onChange={(event) => {
                    const newValue = getValue(event, multiple);
                    onChange(processValue(schema, newValue));
                }}
            >
                {!multiple && schema.default === undefined && (
                    <option value="">{ placeholder }</option>
                )}

                {(enumOptions).map(({ value, label }, i) => {
                    const disabled = (
                        Array.isArray(enumDisabled) &&
                        enumDisabled.indexOf(value) != -1
                    );
                    return (
                        <option
                            key={i}
                            id={label}
                            value={value}
                            disabled={disabled}
                        >
                            {label}
                        </option>
                    );
                })}
            </Form.Control>
        </InlineWrapper>
    );
};

export default SelectWidget;
