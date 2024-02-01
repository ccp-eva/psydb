import React from 'react';
import inline from '@cdxoo/inline-string';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { withField, withFieldArray } from '@cdxoo/formik-utils';

import { without, jsonpointer } from '@mpieva/psydb-core-utils';
import { SplitPartitioned } from '@mpieva/psydb-ui-layout';
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
        
        var translate = useUITranslation();

        var { value } = formikField;
        var allowedValues = [
            ...without(
                experimentVariants.keys,
                existingTypeValues
            ),
            value.labProcedureTypeKey
        ].filter(it => !!it);

        return (
            <SplitPartitioned partitions={[ 3, 2 ]}>
                <ScalarFields.GenericEnum
                    dataXPath={ `${dataXPath}.labProcedureTypeKey` }
                    //label={ translate('_testing_permission_for') }
                    options={ translate.options(experimentVariants.mapping) }

                    allowedValues={ allowedValues }
                    formGroupClassName='m-0'
                    uiSplit={[ 0,12 ]}

                    required
                />
                <ScalarFields.ExtBool
                    dataXPath={ `${dataXPath}.value` }
                    //label={ translate('_testing_permission_value') }
                    formGroupClassName='pl-4 m-0'
                    uiSplit={[ 0,12 ]}
                    required
                />
            </SplitPartitioned>
        )
    },
    DefaultWrapper: 'NoneWrapper',
});


export const LabProcedurePermissionList = withFieldArray({
    FieldComponent: LabProcedurePermission,
    //ArrayContentWrapper: 'ObjectArrayContentWrapper',
    ArrayItemWrapper: 'ScalarArrayItemWrapper',
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

        existingResearchGroupIds
    } = ps;

    var translate = useUITranslation();

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
                uiSplit={[ 2,10 ]}
                label={ translate('Research Group') }
                dataXPath={ `${dataXPath}.researchGroupId` }
                collection='researchGroup'
                related={ related }
                required
                excludedIds={ existingResearchGroupIds }
                extraOnChange={(next) => {
                    if (shouldSetAccessRights) {
                        var accessExists = !!accessRights.find(it => (
                            it.researchGroupId === next
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
                uiSplit={[ 2,10 ]}
                label={ translate('Permission') }
                dataXPath={ `${dataXPath}.permissionList` }
                existingTypeValues={ existingTypeValues }
                required
                enableMove={ false }
            />
        </>
    );
}

export const SubjectTestingPermission = withField({
    Control,
    DefaultWrapper: 'NoneWrapper',
});
