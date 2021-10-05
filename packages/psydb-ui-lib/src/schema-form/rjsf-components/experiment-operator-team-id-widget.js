import React, { useState, useEffect } from 'react';

import { Form } from '@mpieva/psydb-ui-layout';

import getTextColor from '../../bw-text-color-for-background';
import withFormDecorations from './with-form-decorations';

const ExperimentOperatorTeamIdWidget = (ps) => {
    const {
        schema,
        formContext,

        id,
        name,
        value,
        onChange,
        onBlur,
        onFocus,
    } = ps;

    var teamRecords = formContext.relatedRecords.experimentOperatorTeam;
    return (
        <>
            { teamRecords.map(({ _id, state }) => (
                <div
                    key={ _id }
                    className='p-1 pl-3'
                    style={{
                        backgroundColor: state.color,
                        color: getTextColor(state.color)
                    }}
                    onClick={ (event) => {
                        // FIXME: i hate this so much
                        onChange({ target: { value: _id }})
                    }}
                >
                    <Form.Check>
                        <Form.Check.Input
                            id={ `${id}~${_id}` }
                            type='radio'
                            name={ name }
                            checked={ _id === value }
                            onChange={ () => { /*noop */}}
                        />
                        <Form.Check.Label htmlFor={ `${id}~${_id}` }>
                            { state.name }
                        </Form.Check.Label>
                    </Form.Check>
                </div>
            ))}
        </>
    );
    return (
        <Form.Control
            as='select'
            { ...{
                onChange,
                onBlur,
                onFocus,
                value
            }}
        >
            { teamRecords.map(({ _id, state }) => (
                <div
                    key={ _id }
                    style={{ backgroundColor: state.color }}
                >
                    { state.name }
                </div>
            ))}
        </Form.Control>
    );
}

const WrappedExperimentOperatorTeamIdWidget = withFormDecorations(
    ExperimentOperatorTeamIdWidget
);
export default WrappedExperimentOperatorTeamIdWidget;
