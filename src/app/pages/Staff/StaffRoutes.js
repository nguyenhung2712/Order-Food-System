import Loadable from '../../components/Loadable';
import { lazy } from 'react';

const Upsert = Loadable(lazy(() => import('./Upsert')));
const Detail = Loadable(lazy(() => import('./Detail')));
const Management = Loadable(lazy(() => import('./Management')));

const StaffRoutes = [
    { path: '/staff/add', element: <Upsert /> },
    { path: '/staff/edit/:id', element: <Upsert /> },
    { path: '/staff/:id', element: <Detail /> },
    { path: '/staff/manage', element: <Management /> },
    { path: '/staff/registed', element: <Management /> },
]; 

export default StaffRoutes;
