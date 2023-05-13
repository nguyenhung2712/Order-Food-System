import { SuspenseCustom } from '..';
import useSettings from '../../hooks/useSettings';
import { Layouts } from './index';
import React from 'react';

const Layout = (props) => {
    const { settings } = useSettings();
    const Layout = Layouts[settings.activeLayout];

    return (
        <SuspenseCustom>
            <Layout {...props} />
        </SuspenseCustom>
    );
};

export default Layout;
