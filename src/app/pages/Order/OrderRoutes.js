import Loadable from '../../components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';
import React from 'react';
const Upsert = Loadable(lazy(() => import('./Upsert')));
const Detail = Loadable(lazy(() => import('./Detail')));
const Management = Loadable(lazy(() => import('./Management')));

const OrderRoutes = [
    { path: '/order/add', element: <Upsert />, auth: authRoles.admin },
    { path: '/order/edit/:id', element: <Upsert />, auth: authRoles.middle_staff },
    { path: '/order/:id', element: <Detail />, auth: authRoles.bottom_staff },
    { path: '/order/manage', element: <Management />, auth: authRoles.bottom_staff },
];

export default OrderRoutes;
