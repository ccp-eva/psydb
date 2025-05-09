import React, { useState } from 'react';
import enums from '@mpieva/psydb-schema-enums';
import { unique, only } from '@mpieva/psydb-core-utils';
import { __fixRelated } from '@mpieva/psydb-common-compat';
import { useUIConfig, useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, usePermissions } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, FormHelpers } from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';

import maybeAutoSelect from './maybe-auto-select';

const withLabMethodSelect = (Component) => {
    var WithLabMethodSelect = (ps) => {
        var { studyId, preselectedSubject } = ps;
        
        var config = useUIConfig();
        var permissions = usePermissions();
        var translate = useUITranslation();
        var [ labMethod, setLabMethod ] = useState();

        var [ didFetch, fetched ] = useFetch((agent) => (
            agent.fetchExperimentVariantSettings({
                studyIds: [ studyId ],
                ...(preselectedSubject && {
                    subjectType: preselectedSubject.type,
                })
            })
        ), [ studyId, preselectedSubject?.type ]);

        if (!didFetch) {
            return <LoadingIndicator size='lg' />
        }

        var { records, related } = __fixRelated(fetched.data);

        var [ autoSelected, enabledLabMethods ] = maybeAutoSelect({
            selectables: unique(
                records
                .map(it => it.type)
                .filter(it => (
                    config.enabledLabMethods.includes(it)
                    && permissions.isLabMethodAvailable(it)
                ))
            )
        });
        if (autoSelected) {
            labMethod = autoSelected;
        }
        

        var componentBag = {
            ...ps,
            labMethod,
            allSettingsOfSelectedLabMethod: (
                labMethod
                ? records.filter(it => it.type === labMethod)
                : []
            ),
            labMethodSettingsRelated: related
        }

        return (
            <>
                <FormHelpers.InlineWrapper
                    label={ translate('Lab Workflow Type') }
                >
                    <Controls.GenericEnum
                        value={ labMethod }
                        onChange={ setLabMethod }
                        options={ translate.options(only({
                            from: enums.labMethods.mapping,
                            paths: enabledLabMethods
                        }))}
                        readOnly={ !!autoSelected }
                    />
                </FormHelpers.InlineWrapper>
                { labMethod && (
                    <Component { ...componentBag } />
                )}
            </>
        );
    }
    
    return WithLabMethodSelect;
};

export default withLabMethodSelect;
