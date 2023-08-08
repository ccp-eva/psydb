import React, { useState } from 'react';
import { withField } from '@cdxoo/formik-utils';

import * as enums from '@mpieva/psydb-schema-enums';
import { SplitPartitioned } from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';
import { Fields, useFormikContext } from '@mpieva/psydb-ui-lib';
import getFieldValue from './get-field-value';

export const SubChannelKey = (ps) => {
    return (
        <Fields.GenericEnum
            label='Daten-Kanal'
            dataXPath='$.subChannelKey'
            options={{
                'scientific': 'Normal',
                'gdpr': 'Datenschutz',
            }}
            required
        />
    )
}

export const KeyAndDisplayName = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var { setFieldValue } = useFormikContext();

    return (
        <>
            <Fields.SaneString
                label='Anzeigename'
                dataXPath={ `${dataXPath}.displayName` }
                extraOnChange={ (next) => setFieldValue(
                    `${dataXPath}.key`,
                    next.toLowerCase().replaceAll(/[^A-Za-z0-9]/g, '_')
                )}
                required
            />
            <Fields.SaneString
                label='Interner Key'
                dataXPath={ `${dataXPath}.key` }
                disabled={ !isUnrestricted }
                required
            />
        </>
    )
}

export const MinItemsProp = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    return (
        <Fields.Integer
            label='Mindestanzahl'
            dataXPath={ `${dataXPath}.props.minItems` }
            disabled={ !isUnrestricted }
            required
            min={ 0 }
        />
    )
}

export const MinLengthProp = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    return (
        <Fields.Integer
            label='Zeichen (mindestens)'
            dataXPath={ `${dataXPath}.props.minLength` }
            disabled={ !isUnrestricted }
            required
            min={ 0 }
        />
    )
}

export const IsNullableProp = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    return (
        <Fields.DefaultBool
            label='Optional'
            dataXPath={ `${dataXPath}.props.isNullable` }
            disabled={ !isUnrestricted }
            required
        />
    )
}

export const IsSpecialAgeFrameFieldProp = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    return (
        <Fields.DefaultBool
            label='Altersfenster-Referenz'
            dataXPath={ `${dataXPath}.props.isSpecialAgeFrameField` }
            disabled={ !isUnrestricted }
            required
        />
    )
}

export const SetIdProp = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    return (
        <Fields.HelperSetId
            label='Hilfs-Tabelle'
            dataXPath={ `${dataXPath}.props.setId` }
            disabled={ !isUnrestricted }
            required
        />
    )
}

export const SharedForeignIdProps = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var { values } = useFormikContext();
    var { collection } = getFieldValue(values, `${dataXPath}.props`);

    return (
        <>
            <Fields.GenericEnum
                label='Haupt-Tabelle'
                dataXPath={ `${dataXPath}.props.collection` }
                //enum={ enums.customRecordTypeCollections }
                enum={ enums.foreignIdFieldCollections }
                disabled={ !isUnrestricted }
                required
            />
            <Fields.GenericTypeKey
                label='Datensatz-Typ'
                collection={ collection }
                dataXPath={ `${dataXPath}.props.recordType` }
                disabled={ !isUnrestricted || !collection }
                required
            />
            <ForeignIdConstraints
                label='Constraint'
                dataXPath={ `${dataXPath}.props.constraints` }
                disabled={ !isUnrestricted || !collection }
            />
            {/*<Fields.SaneString
                label='Datensatz-Typ'
                dataXPath={ `${dataXPath}.props.recordType` }
                disabled={ !isUnrestricted }
                required
            />*/}
        </>
    )
}

const ForeignIdConstraints = withField({ Control: (ps) => {
    var { label, dataXPath, disabled } = ps;
    var { values, setFieldValue } = useFormikContext();
    var constraints = getFieldValue(values, `${dataXPath}`)
    var [ internal, setInternal ] = useState(
        Object.keys(constraints).length > 0
        ? Object.keys(constraints).map(it => ({
            key: it,
            value: constraints[it]
        }))
        : [{ key: '', value: '' }]
    )
    
    console.log(constraints);
    
    var performUpdate = ({ index, nextKey, nextValue }) => {
        var nextInternal = [ ...internal ];

        if (nextKey !== undefined) {
            internal[index].key = nextKey;
        }
        if (nextValue !== undefined) {
            internal[index].value = nextValue;
        }

        var nextConstraints = nextInternal.reduce((acc, it) => ({
            ...acc,
            ...(String(it.key) !== '' && { [String(it.key)]: (
                it.value
            ) })
        }), {});
        
        setInternal(nextInternal);
        setFieldValue(`${dataXPath}`, nextConstraints);
    }

    return (
        <div>
            <b className='text-danger'>
                DANGER: Experimental feature!!
            </b>
            { internal.map((it, ix) => (
                <ConstraintPair
                    key={ ix }
                    disabled={ disabled }
                    index={ ix }
                    internal={ internal }
                    onChangeKey={(ev) => {
                        var next = ev.target.value;
                        next = next.replace(/\s/g, '_');
                        performUpdate({
                            index: ix,
                            nextKey: next
                        });
                        
                    }}
                    onChangeValue={(ev) => {
                        performUpdate({
                            index: ix,
                            nextValue: ev.target.value
                        });
                    }}
                />
            ))}
            { !disabled && (
                <a 
                    role='button'
                    onClick={ () => setInternal([
                        ...internal, { key: '', value: '' }
                    ])}
                >
                    <b>
                        + additional Constraint
                    </b>
                </a>
            )}
        </div>
    );
}})

const ConstraintPair = (ps) => {
    var { index, internal, onChangeKey, onChangeValue, disabled } = ps;

    return (
        <SplitPartitioned partitions={[1,1]}>
            <Controls.SaneString
                type='text'
                placeholder='Key'
                value={ internal[index].key }
                disabled={ disabled }
                onChange={ onChangeKey }
            />
            <Controls.SaneString
                type='text'
                value={ internal[index].value }
                placeholder='Value'
                disabled={ disabled }
                onChange={ onChangeValue }
            />
        </SplitPartitioned>
    )
}

export const DisplayEmptyAsUnknownProp = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    return (
        <Fields.DefaultBool
            label='Leer als "Unbekannt"'
            dataXPath={ `${dataXPath}.props.displayEmptyAsUnknown` }
            disabled={ !isUnrestricted }
            required
        />
    )
}
