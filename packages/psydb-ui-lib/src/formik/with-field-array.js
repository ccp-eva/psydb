import React from 'react';
import { FieldArray } from 'formik';
import { extractFrom } from '@mpieva/psydb-core-utils';
import { FormHelpers } from '@mpieva/psydb-ui-layout';
import WithField from './with-field';

const WithFieldArray = (options) => {
    var {
        Control,
        //DefaultWrapper,
        //InArrayWrapper,
        ArrayContentWrapper = FormHelpers.ObjectArrayContentWrapper,
        ArrayItemWrapper = FormHelpers.ObjectArrayItemWrapper,
        defaultItemValue = {},
    } = options;

    const ArrayControl = (ps) => {
        var { dataXPath } = ps;
        return (
            <FieldArray name={ dataXPath }>
                {(helpers) => (
                    <ArrayContent
                        { ...ps }
                        inArray={ true }
                        formikArrayHelpers={ helpers }
                    />
                )}
            </FieldArray>
        )
    }

    const ArrayContent = (ps) => {
        var {
            dataXPath,
            formikField,
            formikMeta,
            formikForm,
            formikArrayHelpers,
            disabled,
            enableMove,
            enableRemove,

            contentClassName,
            contentExtraClassName,
            contentFallbackLabel,
            
            ...downstream
        } = ps;


        var { getFieldProps } = formikForm;
        var values = getFieldProps(dataXPath).value || [];

        var sharedBag = {
            formikArrayHelpers,
            disabled
        };

        return (
            <ArrayContentWrapper { ...({
                ...sharedBag,
                defaultItemValue,
                itemsCount: values.length,

                className: contentClassName,
                extraClassName: contentExtraClassName,
                fallbackLabel: contentFallbackLabel,
            })} >
                { values.map((value, index) => {
                    var sharedItemBag = {
                        ...sharedBag,
                        index,
                        lastIndex: values.length - 1,
                        enableMove,
                        enableRemove,
                    };
                    return (
                        <ArrayItemWrapper key={ index } { ...sharedItemBag }>
                            <Control { ...({
                                ...downstream,
                                ...sharedItemBag,
                                dataXPath: `${dataXPath}[${index}]`,
                                formikField,
                                formikMeta,
                                formikForm,
                            })} />
                        </ArrayItemWrapper>
                    );
                }) }
            </ArrayContentWrapper>
        )
    }

    return WithField({
        Control: ArrayControl,
        DefaultWrapper: FormHelpers.InlineArrayWrapper,
    });
}

export default WithFieldArray;
