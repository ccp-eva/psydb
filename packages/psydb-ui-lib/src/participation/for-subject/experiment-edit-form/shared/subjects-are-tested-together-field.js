import React from 'react';
import { Fields, useFormikContext } from '../../../../formik';

const undefineKeys = (keys) => (
    keys.reduce((acc, key) => ({
        ...acc, [key]: undefined
    }), {})
)

const setAllValues = (formikContext, nextValues) => {
    var { setFieldValue } = formikContext;
    Object.keys(nextValues).forEach((key) => {
        var value = nextValues[key];
        setFieldValue(key, value)
    });
}

export const SubjectsAreTestedTogetherField = (ps) => {
    var formik = useFormikContext();
    var { values, setFieldValue } = formik;
    var { subjectData = [] } = values['$'];

    return (
        <Fields.DefaultBool
            label='Gruppentermin'
            dataXPath='$.subjectsAreTestedTogether'
            extraOnChange={(next) => {
                if (next === true) {
                    setAllValues(formik, {
                        '$.subjectData': subjectData.map(
                            ({ timestamp, ...rest }) => rest
                        )
                    })
                }
                else {
                    setAllValues(formik, {
                        ...undefineKeys([
                            '$.timestamp',
                        ])
                    });
                }
            }}
        />
    )
}
