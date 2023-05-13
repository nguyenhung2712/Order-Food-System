import useSettings from '../../hooks/useSettings';
import SecondarySidenavTheme from '../MatxTheme/SecondarySidenavTheme/SecondarySidenavTheme';
import SecondarySidebarContent from './SecondarySidebarContent';
import SecondarySidebarToggle from './SecondarySidebarToggle';
import React from 'react';

const SecondarySidebar = () => {
    const { settings } = useSettings();
    const secondarySidebarTheme = settings.themes[settings.secondarySidebar.theme];

    return (
        <SecondarySidenavTheme theme={secondarySidebarTheme}>
            {settings.secondarySidebar.open && <SecondarySidebarContent />}
            <SecondarySidebarToggle />
        </SecondarySidenavTheme>
    );
};

export default SecondarySidebar;
