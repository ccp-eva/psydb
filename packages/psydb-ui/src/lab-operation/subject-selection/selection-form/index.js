import React from 'react';
import { groupBy } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

import { createInitialValues } from '../utils';
import { StudyPanel } from './study-panel';

export const SelectionForm = (ps) => {
    var {
        studyRecords,
        subjectCRT,
        subjectTypeRecord,
        ageFrameRecords,
        ageFrameRelated,

        onSubmit,
    } = ps;

    var [{ translate, locale }] = useI18N();

    var ageFramesForStudy = groupBy({
        items: ageFrameRecords,
        byProp: 'studyId',
    });

    var initialValues = createInitialValues({ ageFrameRecords, locale });

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ onSubmit }
        >
            {(formikProps) => (
                <>
                    <header className='pb-1 mb-3 border-bottom'>
                        <b>{ translate('Appointment Time Range') }</b>
                    </header>
                    <Fields.DateOnlyServerSide
                        label={ translate('Start') }
                        dataXPath='$.interval.start'
                    />
                    <Fields.DateOnlyServerSide
                        label={ translate('End') }
                        dataXPath='$.interval.end'
                    />
                    { studyRecords.map((study) => (
                        <StudyPanel key={ study._id } { ...({
                            studyId: study._id,
                            shorthand: study.state.shorthand,
                            subjectCRT,
                            subjectTypeRecord,
                            ageFrameRecords: ageFramesForStudy[study._id],
                            ageFrameRelated
                        })} />
                    ))}
                    <hr />
                    <Button type='submit'>
                        { translate('Search') }
                    </Button>
                </>
            )}
        </DefaultForm>
    );
}

