import React from 'react';
import TextWidget from './text-widget';

const PasswordWidget = (ps) => (
  <TextWidget { ...ps } type='password' />
);

export default PasswordWidget;
