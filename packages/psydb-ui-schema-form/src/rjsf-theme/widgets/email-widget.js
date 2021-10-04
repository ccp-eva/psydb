import React from 'react';
import TextWidget from './text-widget';

const EmailWidget = (ps) => (
  <TextWidget { ...ps } type='email' />
);

export default EmailWidget;
