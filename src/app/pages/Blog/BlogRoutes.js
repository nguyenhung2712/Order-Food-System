import Loadable from '../../components/Loadable';
import { lazy } from 'react';
import React from 'react';

const Upsert = Loadable(lazy(() => import('./Upsert')));
const Detail = Loadable(lazy(() => import('./Detail')));
const Management = Loadable(lazy(() => import('./Management')));

const BlogRoutes = [
    { path: '/blog/add', element: <Upsert /> },
    { path: '/blog/edit/:id', element: <Upsert /> },
    { path: '/blog/:id', element: <Detail /> },
    { path: '/blog/manage', element: <Management /> },
];

export default BlogRoutes;
