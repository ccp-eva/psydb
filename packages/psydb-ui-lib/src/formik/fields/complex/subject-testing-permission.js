import React from 'react';
import jsonpointer from 'jsonpointer';
import inline from '@cdxoo/inline-string';
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

    var { values: allFormValues, setFieldValue } = formikForm;
    var { value } = formikField;
    var { permissionList } = value;

    var accessRightsPointer = inline`
        /$
        /scientific/systemPermissions
        /accessRightsByResearchGroup
    `;

    var accessRights = jsonpointer.get(
        allFormValues,
        accessRightsPointer
    );
    var shouldSetAccessRights = !!accessRights;

    // filter existing permission types, to prevent double selection
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
                extraOnChange={(next) => {
                    if (shouldSetAccessRights) {
                        var accessExists = !!accessRights.find(it => (
                            it.researchGroupId === value
                        ));
                        var path = inline`
                            $
                            .scientific.systemPermissions
                            .accessRightsByResearchGroup
                        `;
                        if (accessExists) {
                            // TODO maybe remove?
                        }
                        else {
                            setFieldValue(path, [
                                ...accessRights,
                                { researchGroupId: next, permission: 'write' }
                            ])
                        }
                    }
                }}
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
