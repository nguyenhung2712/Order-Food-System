import Loadable from '../../components/Loadable';
import { lazy } from 'react';
import React from 'react';
const Calendar = Loadable(lazy(() => import('./Calendar')));

const CalendarRoutes = [
    { path: '/calendar', element: <Calendar /> },
    { path: '/calendar/:id', element: <Calendar /> }
];

export default CalendarRoutes;
