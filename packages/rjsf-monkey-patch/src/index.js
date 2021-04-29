import React, { forwardRef } from 'react';
import { default as RJSF, utils } from '@rjsf/core';
import validateFormData from './validate';
const {
  retrieveSchema,
} = utils;

class RJSFMonkey extends RJSF {
    constructor (ps) {
        super(ps);
    }

    validate(
        formData,
        schema = this.props.schema,
        additionalMetaSchemas = this.props.additionalMetaSchemas,
        customFormats = this.props.customFormats
    ) {
        const { validate, transformErrors } = this.props;
        const { rootSchema } = this.getRegistry();
        const resolvedSchema = retrieveSchema(schema, rootSchema, formData);
        //console.log(formData);
        //console.log(resolvedSchema);
        return validateFormData(
            formData,
            resolvedSchema,
            validate,
            transformErrors,
            additionalMetaSchemas,
            customFormats
        );
    }

}

const withTheme = (themeProps) => forwardRef(
    ({ fields, widgets, ...directProps }, ref) => {
        fields = { ...themeProps.fields, ...fields };
        widgets = { ...themeProps.widgets, ...widgets };

        return (
            <RJSFMonkey
                { ...themeProps }
                { ...directProps }
                fields={ fields }
                widgets={ widgets }
                ref={ ref }
            />
        );
    }
)

export { withTheme, utils };
export default RJSFMonkey;
