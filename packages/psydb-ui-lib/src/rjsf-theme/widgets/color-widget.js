import React from 'react';
import TextWidget from './text-widget';

const ColorWidget = (ps) => (
  <TextWidget { ...ps } type='color' />
);

export default ColorWidget;
