/* import AuthGuard from './auth/AuthGuard';
import chartsRoute from './views/charts/ChartsRoute';
import dashboardRoutes from './views/dashboard/DashboardRoutes';
import materialRoutes from './views/material-kit/MaterialRoutes'; */
import AuthGuard from './auth/AuthGuard';
import NotFound from './pages/Auth/NotFound';
import AuthRoutes from './pages/Auth/AuthRoutes';
import ProductRoutes from './pages/Product/ProductRoutes';
import BlogRoutes from './pages/Blog/BlogRoutes';
import StaffRoutes from './pages/Staff/StaffRoutes';

/* import { Navigate } from 'react-router-dom'; */
import Layout from './components/MatxLayout/Layout';

/* const routes = [
    {
        element: (
            <AuthGuard>
                <MatxLayout />
            </AuthGuard>
        ),
        children: [...dashboardRoutes, ...chartsRoute, ...materialRoutes],
    },
    ...sessionRoutes,
    { path: '/', element: <Navigate to="dashboard/default" /> },
    { path: '*', element: <NotFound /> },
]; */

const routes = [
    {
        element: (
            <AuthGuard>
                <Layout />
            </AuthGuard>
        ),
        children: [...ProductRoutes, ...BlogRoutes, ...StaffRoutes],
    },
    ...AuthRoutes,
    { path: '/unauthorized', element: <NotFound /> },
    { path: '*', element: <NotFound /> },
];

export default routes;
