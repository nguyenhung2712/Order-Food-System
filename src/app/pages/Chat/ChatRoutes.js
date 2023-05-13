import Loadable from '../../components/Loadable';
import { lazy } from 'react';
import React from 'react';
const Chat = Loadable(lazy(() => import('./Chat')));

const ChatRoutes = [
    { path: '/chat', element: <Chat /> },
];

export default ChatRoutes;
