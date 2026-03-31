import React from 'react';
import { Grid } from '@mpieva/psydb-ui-layout';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Fields, withField, withFieldArray} from '@mpieva/psydb-ui-lib';

var Task = withField({
    DefaultWrapper: ({ children }) => (<>{ children }</>),
    Control: (ps) => {
        var { dataXPath, disabled } = ps;
        var [{ translate }] = useI18N();

        var sharedBag = {
            disabled, formGroupClassName: 'm-0', uiSplit: [ 0,12 ]
        }

        return (
            <Grid
                cols={[ '110px', '110px', '1fr', '110px', '200px']}
                gap='.5rem'
            >
                <Fields.DateOnlyServerSide
                    { ...sharedBag }
                    dataXPath={ `${dataXPath}.start` }
                />
                <Fields.DateOnlyServerSide
                    { ...sharedBag }
                    dataXPath={ `${dataXPath}.end` }
                />
                <Fields.SaneString
                    { ...sharedBag }
                    dataXPath={ `${dataXPath}.description` }
                />
                <Fields.GenericEnum
                    { ...sharedBag }
                    dataXPath={ `${dataXPath}.status` }
                    options={{
                        'planned': translate('_studyRoadmapStatus_planned'),
                        'ongoing': translate('_studyRoadmapStatus_ongoing'),
                        'finished': translate('_studyRoadmapStatus_finished'),
                    }}
                />
                <Fields.ForeignId
                    { ...sharedBag }
                    collection='personnel'
                    dataXPath={ `${dataXPath}.assignedTo` }
                />
            </Grid>
        )
    }
});

var TaskList = withFieldArray({
    FieldComponent: Task,
    ArrayFieldWrapper: 'NoneWrapper',
    ArrayItemWrapper: 'ScalarArrayItemWrapper',
    //ArrayItemWrapper: 'NoneWrapper',
    defaultItemValue: (ps) => ({
        '_id': null,
    })
})

const StudyRoadmap = (ps) => {
    var { dataXPath } = ps;
    var [{ translate }] = useI18N();

    return (
        <>
            <hr />
            <h5>{ translate('Roadmap') }</h5>
            <Grid
                style={{ marginLeft: '64px', marginRight: '56px' }}
                cols={[ '118px', '118px', '1fr', '118px', '200px' ]}
                className='border-bottom mb-3'
            >
                <b>{ translate('Start') }</b>
                <b>{ translate('End') }</b>
                <b>{ translate('Description') }</b>
                <b>{ translate('Status') }</b>
                <b>{ translate('Assigned To') }</b>
            </Grid>
            <TaskList
                dataXPath={ `${dataXPath}.tasks`}
                enableMove={ false }
                contentClassName='m-0'
            />
            <hr />
        </>
    )
}

export default StudyRoadmap;
