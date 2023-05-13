import Loadable from '../../components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';
import React from 'react';

const Upsert = Loadable(lazy(() => import('./Upsert')));
const Detail = Loadable(lazy(() => import('./Detail')));
const Management = Loadable(lazy(() => import('./Management')));

const ProductRoutes = [
    { path: '/product/add', element: <Upsert />, auth: authRoles.admin },
    { path: '/product/edit/:id', element: <Upsert />, auth: authRoles.middle_staff },
    { path: '/product/:id', element: <Detail />, auth: authRoles.bottom_staff },
    { path: '/product/manage', element: <Management />, auth: authRoles.bottom_staff },
];

export default ProductRoutes;
