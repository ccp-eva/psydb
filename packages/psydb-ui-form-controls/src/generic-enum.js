import React from 'react';
import { PaddedText } from '@mpieva/psydb-ui-layout';
import { Control, fixSelectProps } from './core';

const toEnum = (options) => {
    // if options === [{ key: 'foo', label: 'The Foo' }, ... ]
    if (Array.isArray(options)) {
        var _enum = { keys: [], labels: [] };
        for (var it of options) {
            _enum.keys.push(it.key);
            _enum.labels.push(it.labels);
        }
        return _enum;
    }

    // if options === { foo: 'The Foo', ... }
    if (typeof options === 'object') {
        var _enum = { keys: [], labels: [] };
        for (var key of Object.keys(options)) {
            _enum.keys.push(key);
            _enum.labels.push(options[key]);
        }
        return _enum;
    }

    throw new Error('options must either be an object or an array')
}

export const GenericEnum = (ps) => {
    var {
        enum: enumeration,
        options,
        allowedValues,

        value,
        onChange,
        useRawOnChange = false,
        alwaysIncludeEmptyOption = false,

        // FIXME: why are thei here?
        enableUnknownValue,
        extraContentWrapperProps,
        extraItemWrapperProps,
        readOnly,

        saneFormikField,
        enableOtherValue,
        formGroupClassName,
        uiSplit,

        ...pass
    } = ps;

    if (!enumeration && !options) {
        throw new Error('neither "enum" nor "options" prop is set');
    }

    if (!enumeration) {
        enumeration = toEnum(options);
    }
    allowedValues = allowedValues || enumeration.keys;

    if (!useRawOnChange) {
        ({ onChange, value } = fixSelectProps({
            actualValueList: enumeration.keys,
            onChange,
            value
        }));
    }

    var hasEmptyOption = (
        (useRawOnChange && !enumeration.keys.includes(value)) ||
        (!useRawOnChange && value === -1) ||
        alwaysIncludeEmptyOption
    );

    // FIXME: either use names xor labels
    if (enumeration.names) {
        enumeration.labels = enumeration.names;
    }

    if (readOnly) {
        return (
            <PaddedText><b>
                { enumeration.labels[value] }
            </b></PaddedText>
        )
    }

    var renderedOptions = [];
    for (var [ ix, key ] of enumeration.keys.entries()) {
        if (!allowedValues.includes(key)) {
            continue;
        }

        renderedOptions.push(
            <option key={ ix } value={ useRawOnChange ? key : ix }>
                { enumeration.labels[ix] }
            </option>
        );
    }

    return (
        <Control
            as="select"
            value={ value }
            onChange={ onChange }
            { ...pass }
        >
            { hasEmptyOption && (
                <option></option>
            )}

            { renderedOptions }
        </Control>
    )
};
