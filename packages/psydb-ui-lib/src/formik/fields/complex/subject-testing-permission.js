import React from 'react';
import { withField, withFieldArray } from '@cdxoo/formik-utils';
import { without } from '@mpieva/psydb-core-utils';
import { experimentVariants } from '@mpieva/psydb-schema-enums';
import * as ScalarFields from '../scalar';

const LabProcedurePermission = withField({
    Control: (ps) => {
        var {
            dataXPath,
            formikField,
            formikMeta,
            formikForm,
            disabled,
            existingTypeValues,
        } = ps;
        
        var { value } = formikField;
        var allowedValues = [
            ...without(
                experimentVariants.keys,
                existingTypeValues
            ),
            value.labProcedureTypeKey
        ].filter(it => !!it);

        return (
            <>
                <ScalarFields.GenericEnum
                    dataXPath={ `${dataXPath}.labProcedureTypeKey` }
                    label='Für'
                    enum={ experimentVariants }

                    allowedValues={ allowedValues }

                    required
                />
                <ScalarFields.ExtBool
                    dataXPath={ `${dataXPath}.value` }
                    label='Erlaubnis'
                    required
                />
            </>
        )
    },
    DefaultWrapper: 'NoneWrapper',
});


export const LabProcedurePermissionList = withFieldArray({
    FieldComponent: LabProcedurePermission,
    ArrayContentWrapper: 'ObjectArrayContentWrapper',
    ArrayItemWrapper: 'ObjectArrayItemWrapper',
    defaultItemValue: { value: 'yes' }
});

const Control = (ps) => {
    var {
        dataXPath,
        formikField,
        formikMeta,
        formikForm,
        disabled,
        related,
    } = ps;

    var { value } = formikField;
    var { permissionList } = value;

    var existingTypeValues = [];
    if (Array.isArray(permissionList)) {
        existingTypeValues = (
            permissionList
            .map(it => it.labProcedureTypeKey)
            .filter(it => !!it)
        );
    }

    return (
        <>
            <ScalarFields.ForeignId
                label='Forschungsgruppe'
                dataXPath={ `${dataXPath}.researchGroupId` }
                collection='researchGroup'
                related={ related }
                required
            />
            <LabProcedurePermissionList
                label='Einstellungen'
                dataXPath={ `${dataXPath}.permissionList` }
                existingTypeValues={ existingTypeValues }
                required
            />
        </>
    );
}

export const SubjectTestingPermission = withField({
    Control,
    DefaultWrapper: 'NoneWrapper',
});
