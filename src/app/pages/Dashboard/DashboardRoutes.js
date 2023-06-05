import Loadable from '../../components/Loadable';
import { lazy } from 'react';
import React from 'react';
const Blog = Loadable(lazy(() => import('./BlogAnalytic')));
const Order = Loadable(lazy(() => import('./OrderAnalytic')));
const Product = Loadable(lazy(() => import('./ProductAnalytic')));
const Dashboard = Loadable(lazy(() => import('./Dashboard')));

const dashboardRoutes = [
    { path: '/analytic/blogs', element: <Blog /> },
    { path: '/analytic/orders', element: <Order /> },
    { path: '/analytic/products', element: <Product /> },
    { path: '/dashboard', element: <Dashboard /> },
];

export default dashboardRoutes;
