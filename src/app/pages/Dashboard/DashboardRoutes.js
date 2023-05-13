import Loadable from '../../components/Loadable';
import { lazy } from 'react';
import React from 'react';
const Analytics = Loadable(lazy(() => import('./Analytics')));

const dashboardRoutes = [
    { path: '/dashboard', element: <Analytics /> },
];

export default dashboardRoutes;
