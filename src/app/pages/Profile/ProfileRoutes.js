import Loadable from '../../components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';
import React from 'react';

const Profile = Loadable(lazy(() => import('./Profile')));

const ProfileRoutes = [
    { path: '/profile', element: <Profile /> }
];

export default ProfileRoutes;
