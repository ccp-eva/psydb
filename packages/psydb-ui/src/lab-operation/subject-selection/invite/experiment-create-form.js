import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Pair, SmallFormFooter, AsyncButton } from '@mpieva/psydb-ui-layout';
import { Row } from '@mpieva/psydb-ui-layout'; // XXX
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

const Component = (ps) => {
    var {
        subjectLabel,
        start,
        minEnd,
        maxEnd,
        slotDuration,

        initialValues, onSubmit,
    } = ps;

    var [{ translate }] = useI18N();
    
    var contactBag = { subjectLabel }
    var experimentBag = { start, minEnd, maxEnd, slotDuration }

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ onSubmit }
            useAjvAsync
        >
            {(formikProps) => (
                <>
                    <ContactFields { ...contactBag }/>
                    <ExperimentFields { ...experimentBag }  />
                    <hr />
                    <FormFooter { ...formikProps } />
                </>
            )}
        </DefaultForm>
    )
}

const ContactFields = (ps) => {
    var { subjectLabel } = ps;
    var [{ translate }] = useI18N();

    return (
        <>
            <Pair className='m-0 mb-2' label={ translate('Subject') }>
                { subjectLabel }
            </Pair>
            <Fields.SaneString
                label={ translate('Comment') }
                dataXPath='$.comment'
                uiSplit={[ 4, 8 ]}
            />
            <Fields.GenericEnum
                label={ translate('Confirm') }
                dataXPath='$.autoConfirm'
                enum={{ keys: [ false, true ], labels: [ 'No', 'Yes' ] }}
                uiSplit={[ 4, 8 ]}
            />
        </>
    )
}

const ExperimentFields = (ps) => {
    var { start, minEnd, maxEnd, slotDuration } = ps;
    var [{ translate, fdate }] = useI18N();
    
    if (minEnd === undefined) {
        minEnd = new Date(start.getTime() + slotDuration - 1);
    }

    var _enum = { keys: [], labels: [] };
    for (var t = minEnd.getTime(); t < maxEnd.getTime(); t += slotDuration) {
        _enum.keys.push(t);
        _enum.labels.push(fdate(t + 1, 'p'))
    }


    return (
        <>
            <Pair className='m-0 mb-2' label={ translate('Date') }>
                { fdate(start, 'P') }
            </Pair>

            <Pair className='m-0 mb-2'label={ translate('Start') }>
                { fdate(start, 'p') }
            </Pair>
            
            <Fields.GenericEnum
                label={ translate('End') }
                dataXPath='$.end'
                enum={ _enum }
                uiSplit={[ 4, 8 ]}
            />
        </>
    )
}

const FormFooter = (ps) => {
    var { isSubmitting } = ps;
    var [{ translate }] = useI18N();

    return (
        <SmallFormFooter>
            <AsyncButton type='submit' isTransmitting={ isSubmitting }>
                { translate('Save') }
            </AsyncButton>
        </SmallFormFooter>
    )
}

const createDefaults = (bag) => {
    return {
        autoConfirm: false,
        comment: '',
    }
}

const out = {
    Component,
    createDefaults
}
export default out;
