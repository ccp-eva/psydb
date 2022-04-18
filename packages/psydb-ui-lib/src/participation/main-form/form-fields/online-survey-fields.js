import React from 'react';
import * as Fields from './fields';

export const OnlineSurveyFields = (ps) => {
    return (
        <>
            <Fields.Timestamp />
            <Fields.Status type='online-survey' />
        </>
    );
}
