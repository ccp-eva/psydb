import React from 'react';
import classnames from 'classnames';
import { withField } from '@cdxoo/formik-utils';
import { hasNone } from '@mpieva/psydb-core-utils';
import { PaddedText } from '@mpieva/psydb-ui-layout';

export const OpsTeamSelect = withField({ Control: (ps) => {
    var {
        dataXPath,
        formikField,
        formikMeta,
        formikForm,

        // FIXME: this is the earliest place to prevent
        // this from being passed down to select which will
        // give big prop warning; see Address
        labelClassName,
        ...pass
    } = ps;

    var { error } = formikMeta;
    var { setFieldValue } = formikForm;
    var { value } = formikField;

    return (
        <OpsTeamSelectControl
            onChange={ (next) => setFieldValue(dataXPath, next) }
            value={ value }
            isInvalid={ !!error }
            { ...pass }
        />
    );
}})

const OpsTeamSelectControl = (ps) => {
    var { value, onChange, teamRecords, disabled } = ps;

    return (
        hasNone(teamRecords)
        ? (
            <PaddedText className='text-danger'>
                Keine Teams vorhanden
            </PaddedText>
        )
        : teamRecords.map((it, ix) => (
                <OpsTeamItem
                    key={ ix }
                    
                    id={ it._id }
                    name={ it.state.name }
                    color={ it.state.color }

                    active={ it._id === value }
                    onClick={ !disabled && onChange }
                />
        ))
    )
}

const OpsTeamItem = (ps) => {
    var { id, name, color, active, onClick } = ps;
    var disabled = !onClick;

    var mainClassName = classnames([
        'd-flex border',
        'experiment-operator-team-list-item',
        disabled ? 'bg-light text-grey' : 'bg-white hover',
        active && 'active'
    ]);

    var colorSquareStyle = {
        flexShrink: 0,
        width: '35px',
        ...(
            disabled
            ? {
                background: color,
                border: `1px solid ${color}`,
            }
            : {
                background: color,
                border: `1px solid ${color}`,
            }
        )
    }

    return (
        <div
            className={ mainClassName }
            onClick={ !disabled ? (() => onClick(id)) : undefined }
            role={ disabled ? '': 'button' }
        >
            <div style={ colorSquareStyle }></div>
            <div className='flex-grow pl-3' style={{
                paddingTop: '0.375rem',
                paddingBottom: '0.375rem',
            }}>
                <b>{ name }</b>
            </div>
        </div>
    )

}
