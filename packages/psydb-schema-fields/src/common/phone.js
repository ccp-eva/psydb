var Phone = ({
    ...additionalProps
}) => ({
    title: 'Telefonnummer',
    type: 'string',
    format: 'phone-number', // custom format
    systemType: 'Phone',
    ...additionalProps,
});

module.exports = Phone;
