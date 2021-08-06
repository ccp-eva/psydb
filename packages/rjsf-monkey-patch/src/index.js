import React, { forwardRef } from 'react';
import { default as RJSF, utils } from '@rjsf/core';
import validateFormData from './validate';

import {
    retrieveSchema,
    getDefaultFormState,
    toIdSchema,
} from './utils';

class RJSFMonkey extends RJSF {
    constructor (ps) {
        super(ps);
        //console.log('COSNTRUCTOR', ps.formData.reservationSettings);
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
        var validated = validateFormData(
            formData,
            resolvedSchema,
            validate,
            transformErrors,
            additionalMetaSchemas,
            customFormats
        );

        return validated;
    }

    getStateFromProps(props, inputFormData) {

        const state = this.state || {};
        const schema = "schema" in props ? props.schema : this.props.schema;
        const uiSchema = "uiSchema" in props ? props.uiSchema : this.props.uiSchema;
        const edit = typeof inputFormData !== "undefined";
        const liveValidate =
            "liveValidate" in props ? props.liveValidate : this.props.liveValidate;
        const mustValidate = edit && !props.noValidate && liveValidate;
        const rootSchema = schema;
        const formData = getDefaultFormState(schema, inputFormData, rootSchema);
        console.log('defaultFormStata', formData);
        
        const retrievedSchema = retrieveSchema(schema, rootSchema, formData);
        const customFormats = props.customFormats;
        const additionalMetaSchemas = props.additionalMetaSchemas;

        const getCurrentErrors = () => {
            if (props.noValidate) {
                return { errors: [], errorSchema: {} };
            } else if (!props.liveValidate) {
                return {
                    errors: state.schemaValidationErrors || [],
                    errorSchema: state.schemaValidationErrorSchema || {},
                };
            }
            return {
                errors: state.errors || [],
                errorSchema: state.errorSchema || {},
            };
        };

        let errors,
            errorSchema,
            schemaValidationErrors,
            schemaValidationErrorSchema;
        if (mustValidate) {
            const schemaValidation = this.validate(
                formData,
                schema,
                additionalMetaSchemas,
                customFormats
            );
            errors = schemaValidation.errors;
            errorSchema = schemaValidation.errorSchema;
            schemaValidationErrors = errors;
            schemaValidationErrorSchema = errorSchema;
        } else {
            const currentErrors = getCurrentErrors();
            errors = currentErrors.errors;
            errorSchema = currentErrors.errorSchema;
            schemaValidationErrors = state.schemaValidationErrors;
            schemaValidationErrorSchema = state.schemaValidationErrorSchema;
        }
        if (props.extraErrors) {
            errorSchema = mergeObjects(
                errorSchema,
                props.extraErrors,
                !!"concat arrays"
            );
            errors = toErrorList(errorSchema);
        }
        const idSchema = toIdSchema(
            retrievedSchema,
            uiSchema["ui:rootFieldId"],
            rootSchema,
            formData,
            props.idPrefix
        );
        const nextState = {
            schema,
            uiSchema,
            idSchema,
            formData,
            edit,
            errors,
            errorSchema,
            additionalMetaSchemas,
        };
        if (schemaValidationErrors) {
            nextState.schemaValidationErrors = schemaValidationErrors;
            nextState.schemaValidationErrorSchema = schemaValidationErrorSchema;
        }
        return nextState;
    }

    onSubmit = event => {
        event.preventDefault();
        if (event.target !== event.currentTarget) {
            return;
        }

        event.persist();
        let newFormData = this.state.formData;

        if (this.props.omitExtraData === true) {
            const retrievedSchema = retrieveSchema(
                this.state.schema,
                this.state.schema,
                newFormData
            );
            const pathSchema = toPathSchema(
                retrievedSchema,
                "",
                this.state.schema,
                newFormData
            );

            const fieldNames = this.getFieldNames(pathSchema, newFormData);

            newFormData = this.getUsedFormData(newFormData, fieldNames);
        }

        if (!this.props.noValidate) {
            let schemaValidation = this.validate(newFormData);
            let errors = schemaValidation.errors;
            let errorSchema = schemaValidation.errorSchema;
            const schemaValidationErrors = errors;
            const schemaValidationErrorSchema = errorSchema;
            if (Object.keys(errors).length > 0) {
                if (this.props.extraErrors) {
                    errorSchema = mergeObjects(
                        errorSchema,
                        this.props.extraErrors,
                        !!"concat arrays"
                    );
                    errors = toErrorList(errorSchema);
                }
                this.setState(
                    {
                        errors,
                        errorSchema,
                        schemaValidationErrors,
                        schemaValidationErrorSchema,
                    },
                    () => {
                        if (this.props.onError) {
                            this.props.onError(errors);
                        } else {
                            console.error("Form validation failed", errors);
                        }
                    }
                );
                return;
            }
        }

        let errorSchema;
        let errors;
        if (this.props.extraErrors) {
            errorSchema = this.props.extraErrors;
            errors = toErrorList(errorSchema);
        } else {
            errorSchema = {};
            errors = [];
        }

        this.setState(
            { formData: newFormData, errors: errors, errorSchema: errorSchema },
            () => {
                if (this.props.onSubmit) {
                    this.props.onSubmit(
                        { ...this.state, formData: newFormData, status: "submitted" },
                        event
                    );
                }
            }
        );
    };


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
