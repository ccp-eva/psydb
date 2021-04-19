// XXX: react-datetime needs it and we cant rally get around using
// it since <input type="time"> etc dose not resepect min, max nor step
// and we need the locale to be set for moment to format widget calendars
// properly
require('moment/locale/de');
export { default as TimeWidget } from './time-widget';
export { default as TimeSlotWidget } from './time-slot-widget';
