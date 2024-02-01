import React, { useState } from 'react';
import { unique, keyBy, hasOnlyOne } from '@mpieva/psydb-core-utils';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, FormHelpers } from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';

const withSubjectTypeSelect = (Component) => {
    var WithSubjectTypeSelect = (ps) => {
        var { labMethodSettings, ...pass } = ps;

        var {
            didFetch, fetched,
            subjectType, setSubjectType
        } = fromHooks(ps);

        if (!didFetch) {
            return <LoadingIndicator size='lg' />
        }

        // NOTE: theese arent the full crts
        // but just type and label
        var subjectCRTs = fetched.data;

        var enabledSubjectTypes = unique(
            labMethodSettings.map(it => it.state.subjectTypeKey)
        );
        var showSubjectTypeSelect = true;
        if (hasOnlyOne(enabledSubjectTypes)) {
            showSubjectTypeSelect = false;
            subjectType = enabledSubjectTypes[0];
        }
        
        var filteredSubjectCRTs = subjectCRTs.filter(it => (
            enabledSubjectTypes.includes(it.type)
        ));
        var subjectTypeOptions = keyBy({
            items: filteredSubjectCRTs,
            byProp: 'type',
            transform: (it) => (it.label)
        });
        

        var labMethodSettingsBySubjectType = keyBy({
            items: labMethodSettings,
            byPointer: '/state/subjectTypeKey'
        })

        return (
            <>
                { showSubjectTypeSelect && (
                    <FormHelpers.InlineWrapper label='Proband:innen-Typ'>
                        <Controls.GenericEnum
                            value={ subjectType }
                            onChange={ setSubjectType }
                            options={ subjectTypeOptions }
                        />
                    </FormHelpers.InlineWrapper>
                )}
                { subjectType && (
                    <Component
                        labMethodSettings={
                            labMethodSettingsBySubjectType[subjectType]
                        }
                        subjectType={ subjectType }
                        { ...pass }
                    />
                )}
            </>
        );
    }
    
    return WithSubjectTypeSelect;
};

var fromHooks = (ps) => {
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchCollectionCRTs({ collection: 'subject' })
    ), []);

    var [ subjectType, setSubjectType ] = useState();

    return { didFetch, fetched, subjectType, setSubjectType };
}

export default withSubjectTypeSelect;
