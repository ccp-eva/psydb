import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import * as Scalars from '../scalar';

const SaneString = withField({
    Control: Scalars.SaneString.Control,
    DefaultWrapper: 'FieldWrapperMultiline',
});

const GenericEnum = withField({
    Control: Scalars.GenericEnum.Control,
    DefaultWrapper: 'FieldWrapperMultiline',
});

const Control = (ps) => {
    var { 
        dataXPath,
        formikField,
        formikMeta,
        formikForm,

        disabled,

        isStreetRequired = false,
        isHousenumberRequired = false,
        isAffixRequired = false,
        isPostcodeRequired = false,
        isCityRequired = false,
        isCountryRequired = false
    } = ps;

    var translate = useUITranslation();

    var labelClassName = 'd-block m-0 text-small';

    return (
        <div className='border p-3'>
            <div
                className='d-flex'
                style={{ paddingLeft: '15px' }}
            >
                <div className='flex-grow'>
                    <SaneString
                        label={ translate('Street') }
                        dataXPath={ `${dataXPath}.street` }
                        disabled={ disabled }
                        required={ isStreetRequired }
                        labelClassName={ labelClassName }
                    />
                </div>
                <div className='pl-2' style={{ flexBasis: '7rem' }}>
                    <SaneString
                        label={ translate('_address_housenumber') }
                        dataXPath={ `${dataXPath}.housenumber` }
                        disabled={ disabled }
                        required={ isHousenumberRequired }
                        labelClassName={ labelClassName }
                    />
                </div>
                <div className='pl-2' style={{ flexBasis: '7rem' }}>
                    <SaneString
                        label={ translate('_address_affix') }
                        dataXPath={ `${dataXPath}.affix` }
                        disabled={ disabled }
                        required={ isAffixRequired }
                        labelClassName={ labelClassName }
                    />
                </div>
            </div>
            <div
                className='d-flex'
                style={{ paddingLeft: '15px' }}
            >
                <div style={{ flexBasis: '7rem' }}>
                    <SaneString
                        label={ translate('_address_postcode') }
                        dataXPath={ `${dataXPath}.postcode` }
                        disabled={ disabled }
                        required={ isPostcodeRequired }
                        labelClassName={ labelClassName }
                    />
                </div>
                <div className='flex-grow pl-2'>
                    <SaneString
                        label={ translate('_address_city') }
                        dataXPath={ `${dataXPath}.city` }
                        disabled={ disabled }
                        required={ isCityRequired }
                        labelClassName={ labelClassName }
                    />
                </div>
                <div
                    className='pl-2'
                    style={{ flexBasis: '27%' }}
                >
                    <GenericEnum
                        label={ translate('_address_country') }
                        dataXPath={ `${dataXPath}.country` }
                        disabled={ disabled }
                        required={ isCountryRequired }
                        options={{
                            'DE': 'Deutschland',
                            //'US': 'United States'
                        }}
                        labelClassName={ labelClassName }
                    />
                </div>
            </div>
        </div>
    )
}

export const Address = withField({
    Control,
});
