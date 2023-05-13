import Loadable from '../../components/Loadable';
import { lazy } from 'react';
import React from 'react';
const Upsert = Loadable(lazy(() => import('./Upsert')));
const Detail = Loadable(lazy(() => import('./Detail')));
const Management = Loadable(lazy(() => import('./Management')));

const CustomerRoutes = [
    { path: '/customer/add', element: <Upsert /> },
    { path: '/customer/edit/:id', element: <Upsert /> },
    { path: '/customer/:id', element: <Detail /> },
    { path: '/customer/manage', element: <Management /> }
];

export default CustomerRoutes;
