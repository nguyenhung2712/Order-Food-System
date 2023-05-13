import { ThemeProvider, useTheme } from '@mui/material';
import useSettings from '../../../hooks/useSettings';
import React from 'react';

const SidenavTheme = ({ children }) => {
    const theme = useTheme();
    const { settings } = useSettings();
    const sidenavTheme = settings.themes[settings.layout1Settings.leftSidebar.theme] || theme;

    return <ThemeProvider theme={sidenavTheme}>{children}</ThemeProvider>;
};

export default SidenavTheme;
