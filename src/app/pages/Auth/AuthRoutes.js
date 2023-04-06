import Loadable from '../../components/Loadable';
import AuthPrevent from '../../auth/AuthPrevent';
import { lazy } from 'react';

const Login = Loadable(lazy(() => import('./Login')));
const Register = Loadable(lazy(() => import('./Register')));
const ForgotPass = Loadable(lazy(() => import('./ForgotPass')));
const NotFound = Loadable(lazy(() => import('./NotFound')));
const Unauthorized = Loadable(lazy(() => import('./Unauthorized')));
const EmailConfirm = Loadable(lazy(() => import('./EmailConfirm')));

const AuthRoutes = [
    { path: '/auth/login', element: <AuthPrevent><Login /></AuthPrevent> },
    { path: '/auth/register', element: <AuthPrevent><Register /></AuthPrevent> },
    { path: '/auth/forgot-pass', element: <AuthPrevent><ForgotPass /></AuthPrevent> },
    { path: '/auth/404', element: <NotFound /> },
    { path: '/auth/un-auth', element: <Unauthorized /> },
    { path: '/auth/conf-email', element: <AuthPrevent><EmailConfirm /></AuthPrevent> },
]; 

export default AuthRoutes;
