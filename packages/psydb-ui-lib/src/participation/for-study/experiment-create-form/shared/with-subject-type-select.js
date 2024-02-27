import React, { useState } from 'react';
import { unique, keyBy, hasOnlyOne } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, usePermissions } from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    FormHelpers,
    PaddedText
} from '@mpieva/psydb-ui-layout';

import * as Controls from '@mpieva/psydb-ui-form-controls';


import maybeAutoSelect from './maybe-auto-select';

const withSubjectTypeSelect = (Component) => {
    var WithSubjectTypeSelect = (ps) => {
        var { allSettingsOfSelectedLabMethod, ...pass } = ps;

        var permissions = usePermissions();
        var [ subjectType, setSubjectType ] = useState();
        var translate = useUITranslation();

        var [ autoSelectedType, enabledSubjectTypes ] = maybeAutoSelect({
            selectables: unique(
                allSettingsOfSelectedLabMethod
                .map(it => it.state.subjectTypeKey)
                .filter(it => permissions.isSubjectTypeAvailable(it))
            )
        });
        if (autoSelectedType) {
            subjectType = autoSelectedType
        }

        var maybeRenderedComponent = null;
        if (subjectType) {
            var specificLabMethodSettings = (
                allSettingsOfSelectedLabMethod
                .find(it => it.state.subjectTypeKey === subjectType)
            );

            var componentBag = {
                specificLabMethodSettings,
                subjectType,
                ...pass
            }

            maybeRenderedComponent = (
                <Component { ...componentBag } />
            )
        }

        return (
            <>
                <FormHelpers.InlineWrapper
                    label={ translate('Subject Type') }
                >
                    <Controls.GenericTypeKey
                        collection='subject'
                        allowedTypes={ enabledSubjectTypes }
                        value={ subjectType }
                        onChange={ setSubjectType }
                        readOnly={ !!autoSelectedType }
                    />
                </FormHelpers.InlineWrapper>
                { maybeRenderedComponent }
            </>
        );
    }
    
    return WithSubjectTypeSelect;
};

export default withSubjectTypeSelect;
